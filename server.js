const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require("nodemailer");
const path = require("path");
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PW,
    database: process.env.DB
});

db.connect((error) => {
    if (error) {
        console.error('Failed to connect to database:', error);
    } else {
        console.log('Connected to database.');
    }
});

// // Serve static files from the React build folder
// app.use(express.static(path.join(__dirname, "build")));

// // Handle React routing, return React app for unknown routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail", // or another email service
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.PASSWORD, // Your email password or app password
    },
});

// Email sending route
app.post("/send-email", async (req, res) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error sending email", error });
    }
});

app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Failed to fetch users:', error);
            res.status(500).json({ message: 'Failed to fetch users' });
        }
        res.json(results);
    });
});

// Middleware to check table permissions
const checkTablePermission = async (req, res, next) => {
    const userId = req.body.userId || req.query.userId;
    const tableName = req.params.table || req.body.table;
    
    if (!userId || !tableName) {
        return res.status(403).json({ 
                success: false,
            message: 'Access denied: Missing user ID or table name' 
        });
    }

    const query = 'SELECT * FROM perms WHERE user_id = ? AND table_id = (SELECT id FROM tables WHERE name = ?)';
    
    try {
        const [results] = await db.promise().query(query, [userId, tableName]);
        if (results.length === 0) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied: You do not have permission to access this table' 
            });
        }
        next();
    } catch (error) {
        console.error('Error checking permissions:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error checking permissions' 
        });
    }
};

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body; // keeping username in request for backward compatibility

    try {
        // First get staff info using email
        const [staffs] = await db.promise().query(
            'SELECT id, f_name, l_name, email FROM staffs WHERE email = ? AND password = ?',
            [username, password] // username field contains email
        );

        if (staffs.length > 0) {
            const staff = staffs[0];
            
            // Get staff's table permissions using user_id in perms table
            const [permissions] = await db.promise().query(
                `SELECT t.name as table_name 
                FROM perms p 
                JOIN tables t ON p.table_id = t.id 
                WHERE p.user_id = ?`,
                [staff.id]
            );

            res.json({
                success: true,
                message: 'Login successful',
                results: [{
                    ...staff,
                    permissions: permissions.map(p => p.table_name)
                }]
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
    });
    }
});

// Get all children
app.get('/api/children', (req, res) => {
    const query = 'SELECT * FROM children ORDER BY created_at DESC';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Failed to fetch children:', error);
            res.status(500).json({ message: 'Failed to fetch children' });
        }
        res.json(results);
    });
});

// Get all case categories
app.get('/api/case-categories', (req, res) => {
    const query = 'SELECT case_category_id, case_category FROM case_category ORDER BY case_category_id ASC';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching case categories:', error);
            res.status(500).json({ message: 'Error fetching case categories' });
            return;
        }
        res.json(results);
    });
});

// Get all educational attainment
app.get('/api/education', (req, res) => {
    const query = 'SELECT educational_attainment_id, educational_attainment FROM education ORDER BY educational_attainment_id ASC';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching educational attainment:', error);
            res.status(500).json({ message: 'Error fetching educational attainment' });
            return;
        }
        res.json(results);
    });
});

// Get all events
app.get('/api/events', (req, res) => {
    const query = 'SELECT * FROM events ORDER BY created_at DESC';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ message: 'Error fetching events' });
            return;
        }
        res.json(results);
    });
});

// Get all appointments
app.get('/api/appointments', (req, res) => {
    const query = 'SELECT * FROM appointments ORDER BY created_at DESC';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).json({ message: 'Error fetching appointments' });
            return;
        }
        res.json(results);
    });
});

// Get all volunteers
app.get('/api/volunteers', (req, res) => {
    const query = 'SELECT * FROM volunteers ORDER BY created_at DESC';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching volunteers:', error);
            res.status(500).json({ message: 'Error fetching volunteers' });
            return;
        }
        res.json(results);
    });
});

// Get all employees
app.get('/api/employees', (req, res) => {
    const query = `
        SELECT 
            s.*,
            GROUP_CONCAT(t.name) as permissions
        FROM staffs s
        LEFT JOIN perms p ON s.id = p.user_id
        LEFT JOIN tables t ON p.table_id = t.id
        GROUP BY s.id
        ORDER BY s.created_at DESC
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching employees:', error);
            res.status(500).json({ message: 'Error fetching employees' });
            return;
        }
        res.json(results);
    });
});

// Add logging function
const logAction = (userId, action, affectedTable, recordId) => {
    const query = 'INSERT INTO logs (user_id, action, affected_table, record_id) VALUES (?, ?, ?, ?)';
    db.query(query, [userId, action, affectedTable, recordId], (error) => {
        if (error) {
            console.error('Error logging action:', error);
        }
    });
};

// Modify children endpoints to include logging
app.post('/api/children', (req, res) => {
    const { name, date_of_birth, date_of_admission, referral_source, case_id, services, education_id, case_number, remarks, userId } = req.body;

    // Add this debug log
    console.log('Received data:', {
        name,
        date_of_birth,
        date_of_admission,
        referral_source,
        case_id,
        services,
        education_id,
        case_number,
        remarks,
        userId
    });

    const query = `
        INSERT INTO children 
        (name, date_of_birth, date_of_admission, referral_source, case_id, services, education_id, case_number, remarks) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [
        name,
        date_of_birth,
        date_of_admission,
        referral_source,
        case_id,
        services,
        education_id,
        case_number,
        remarks
    ], (error, results) => {
        if (error) {
            console.error('Error creating child:', error);
            res.status(500).json({ message: 'Error creating child' });
            return;
        }
        logAction(userId, 'create', 'children', results.insertId);
        res.json({ message: 'Child created successfully', id: results.insertId });
    });
});

app.put('/api/children/:id', (req, res) => {
    const { name, date_of_birth, date_of_admission, referral_source, case_id, services, education_id, case_number, remarks, userId } = req.body;
    const query = `
        UPDATE children 
        SET name = ?, 
            date_of_birth = ?, 
            date_of_admission = ?,
            referral_source = ?,
            case_id = ?,
            services = ?,
            education_id = ?,
            case_number = ?,
            remarks = ?
        WHERE id = ?`;

    db.query(query, [
        name,
        date_of_birth,
        date_of_admission,
        referral_source,
        case_id,
        services,
        education_id,
        case_number,
        remarks,
        req.params.id
    ], (error) => {
        if (error) {
            console.error('Error updating child:', error);
            res.status(500).json({ message: 'Error updating child' });
            return;
        }
        logAction(userId, 'update', 'children', req.params.id);
        res.json({ message: 'Child updated successfully' });
    });
});

app.delete('/api/children/:id', (req, res) => {
    const { userId } = req.body;
    const query = 'DELETE FROM children WHERE id = ?';
    db.query(query, [req.params.id], (error) => {
        if (error) {
            console.error('Error deleting child:', error);
            res.status(500).json({ message: 'Error deleting child' });
            return;
        }
        logAction(userId, 'delete', 'children', req.params.id);
        res.json({ message: 'Child deleted successfully' });
    });
});

// Add event
app.post('/api/events', (req, res) => {
    const { event_name, event_description, event_date, start_time, end_time, userId } = req.body;
    const query = 'INSERT INTO events (event_name, event_description, event_date, start_time, end_time) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [event_name, event_description, event_date, start_time, end_time], (error, results) => {
        if (error) {
            console.error('Error adding event:', error);
            res.status(500).json({ message: 'Error adding event' });
            return;
        }
        logAction(userId, 'create', 'events', results.insertId);
        res.json({ message: 'Event added successfully', id: results.insertId });
    });
});

// Update event
app.put('/api/events/:id', (req, res) => {
    const { event_name, event_description, event_date, start_time, end_time, userId } = req.body;
    const query = 'UPDATE events SET event_name = ?, event_description = ?, event_date = ?, start_time = ?, end_time = ? WHERE id = ?';
    db.query(query, [event_name, event_description, event_date, start_time, end_time, req.params.id], (error) => {
        if (error) {
            console.error('Error updating event:', error);
            res.status(500).json({ message: 'Error updating event' });
            return;
        }
        logAction(userId, 'update', 'events', req.params.id);
        res.json({ message: 'Event updated successfully' });
    });
});

// Delete event
app.delete('/api/events/:id', (req, res) => {
    const { userId } = req.body;
    const query = 'DELETE FROM events WHERE id = ?';
    db.query(query, [req.params.id], (error) => {
        if (error) {
            console.error('Error deleting event:', error);
            res.status(500).json({ message: 'Error deleting event' });
            return;
        }
        logAction(userId, 'delete', 'events', req.params.id);
        res.json({ message: 'Event deleted successfully' });
    });
});

// Get all transaction gateways
app.get('/api/transac-gateways', (req, res) => {
    const query = 'SELECT id, transac_gateway FROM transac_gateway ORDER BY id ASC';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching transaction gateways:', error);
            res.status(500).json({ message: 'Error fetching transaction gateways' });
            return;
        }
        res.json(results); // Send the results back to the client
    });
});

// Make a donation
app.post('/api/donations', (req, res) => {
    const { name, email, reference_number, gateway_id } = req.body; // Ensure all required fields are included

    // SQL query to insert the donation into the database
    const query = 'INSERT INTO donations (name, email, reference_number, gateway_id) VALUES (?, ?, ?, ?)';
    
    db.query(query, [name, email, reference_number, gateway_id], (error, results) => {
        if (error) {
            console.error('Error adding donation:', error);
            res.status(500).json({ message: 'Error adding donation' });
            return;
        }
        res.json({ message: 'Donation added successfully', id: results.insertId }); // Respond with success message
    });
});

// Make an appointment
app.post('/api/appointments', (req, res) => {
    const { visitor, email, purpose, visit_date, start_time, end_time } = req.body; // Ensure all required fields are included
    const status = 'pending'; // You can set a default status or modify as needed

    // SQL query to insert the appointment into the database
    const query = 'INSERT INTO appointments (visitor, email, purpose, visit_date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [visitor, email, purpose, visit_date, start_time, end_time, status], (error, results) => {
        if (error) {
            console.error('Error adding appointment:', error);
            res.status(500).json({ message: 'Error adding appointment' });
            return;
        }
        res.json({ message: 'Appointment added successfully', id: results.insertId }); // Respond with success message
    });
});

// Add appointment
app.post('/api/appointments', (req, res) => {
    const { visitor, purpose, visit_date, start_time, end_time, status, userId } = req.body;
    const query = 'INSERT INTO appointments (visitor, purpose, visit_date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [visitor, purpose, visit_date, start_time, end_time, status], (error, results) => {
        if (error) {
            console.error('Error adding appointment:', error);
            res.status(500).json({ message: 'Error adding appointment' });
            return;
        }
        logAction(userId, 'create', 'appointments', results.insertId);
        res.json({ message: 'Appointment added successfully', id: results.insertId });
    });
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
    const { visitor, purpose, visit_date, start_time, end_time, status, userId } = req.body;
    const query = 'UPDATE appointments SET visitor = ?, purpose = ?, visit_date = ?, start_time = ?, end_time = ?, status = ? WHERE id = ?';
    db.query(query, [visitor, purpose, visit_date, start_time, end_time, status, req.params.id], (error) => {
        if (error) {
            console.error('Error updating appointment:', error);
            res.status(500).json({ message: 'Error updating appointment' });
            return;
        }
        logAction(userId, 'update', 'appointments', req.params.id);
        res.json({ message: 'Appointment updated successfully' });
    });
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
    const { userId } = req.body;
    const query = 'DELETE FROM appointments WHERE id = ?';
    db.query(query, [req.params.id], (error) => {
        if (error) {
            console.error('Error deleting appointment:', error);
            res.status(500).json({ message: 'Error deleting appointment' });
            return;
        }
        logAction(userId, 'delete', 'appointments', req.params.id);
        res.json({ message: 'Appointment deleted successfully' });
    });
});

// Add volunteer
app.post('/api/volunteers', (req, res) => {
    const { f_name, l_name, email, contact, userId } = req.body;
    const query = 'INSERT INTO volunteers (f_name, l_name, email, contact) VALUES (?, ?, ?, ?)';
    db.query(query, [f_name, l_name, email, contact], (error, results) => {
        if (error) {
            console.error('Error adding volunteer:', error);
            res.status(500).json({ message: 'Error adding volunteer' });
            return;
        }
        logAction(userId, 'create', 'volunteers', results.insertId);
        res.json({ message: 'Volunteer added successfully', id: results.insertId });
    });
});

// Update volunteer
app.put('/api/volunteers/:id', (req, res) => {
    const { f_name, l_name, email, contact, userId } = req.body;
    const query = 'UPDATE volunteers SET f_name = ?, l_name = ?, email = ?, contact = ? WHERE id = ?';
    db.query(query, [f_name, l_name, email, contact, req.params.id], (error) => {
        if (error) {
            console.error('Error updating volunteer:', error);
            res.status(500).json({ message: 'Error updating volunteer' });
            return;
        }
        logAction(userId, 'update', 'volunteers', req.params.id);
        res.json({ message: 'Volunteer updated successfully' });
    });
});

// Delete volunteer
app.delete('/api/volunteers/:id', (req, res) => {
    const { userId } = req.body;
    const query = 'DELETE FROM volunteers WHERE id = ?';
    db.query(query, [req.params.id], (error) => {
        if (error) {
            console.error('Error deleting volunteer:', error);
            res.status(500).json({ message: 'Error deleting volunteer' });
            return;
        }
        logAction(userId, 'delete', 'volunteers', req.params.id);
        res.json({ message: 'Volunteer deleted successfully' });
    });
});

// Add employee
app.post('/api/employees', async (req, res) => {
    const { f_name, l_name, email, contact, userId } = req.body;
    
    try {
        // Start a transaction
        await db.promise().beginTransaction();
        
        // Check if email already exists
        const [existingStaff] = await db.promise().query(
            'SELECT id FROM staffs WHERE email = ?',
            [email]
        );
        
        if (existingStaff.length > 0) {
            await db.promise().rollback();
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        
        // Generate a temporary password (you might want to send this via email)
        const tempPassword = Math.random().toString(36).slice(-8);
        
        // Insert the staff member with the temporary password
        const [staffResult] = await db.promise().query(
            'INSERT INTO staffs (f_name, l_name, email, contact, password) VALUES (?, ?, ?, ?, ?)',
            [f_name, l_name, email, contact, tempPassword]
        );
        
        const staffId = staffResult.insertId;
        
        // Log the action
        await db.promise().query(
            'INSERT INTO logs (user_id, action, affected_table, record_id) VALUES (?, ?, ?, ?)',
            [userId, 'create', 'staffs', staffId]
        );
        
        // Commit the transaction
        await db.promise().commit();
        
        res.json({ 
            success: true,
            message: 'Employee added successfully', 
            id: staffId,
            tempPassword // In production, send this via email instead
        });
    } catch (error) {
        // Rollback in case of error
        await db.promise().rollback();
        console.error('Error adding employee:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error adding employee' 
        });
    }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
    const { f_name, l_name, email, contact, userId } = req.body;
    
    try {
        // Start a transaction
        await db.promise().beginTransaction();
        
        // Check if email exists for other staff members
        const [existingStaff] = await db.promise().query(
            'SELECT id FROM staffs WHERE email = ? AND id != ?',
            [email, req.params.id]
        );
        
        if (existingStaff.length > 0) {
            await db.promise().rollback();
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        
        // Update the staff member
        const [updateResult] = await db.promise().query(
            'UPDATE staffs SET f_name = ?, l_name = ?, email = ?, contact = ? WHERE id = ?',
            [f_name, l_name, email, contact, req.params.id]
        );
        
        if (updateResult.affectedRows === 0) {
            await db.promise().rollback();
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
        
        // Log the action
        await db.promise().query(
            'INSERT INTO logs (user_id, action, affected_table, record_id) VALUES (?, ?, ?, ?)',
            [userId, 'update', 'staffs', req.params.id]
        );
        
        // Commit the transaction
        await db.promise().commit();
        
        res.json({
            success: true,
            message: 'Employee updated successfully'
        });
    } catch (error) {
        // Rollback in case of error
        await db.promise().rollback();
        console.error('Error updating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating employee'
        });
    }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
    const { userId } = req.body;
    
    try {
        // Start a transaction
        await db.promise().beginTransaction();
        
        // First delete related permissions
        await db.promise().query(
            'DELETE FROM perms WHERE user_id = ?',
            [req.params.id]
        );
        
        // Then delete the staff member
        const [deleteResult] = await db.promise().query(
            'DELETE FROM staffs WHERE id = ?',
            [req.params.id]
        );
        
        if (deleteResult.affectedRows === 0) {
            await db.promise().rollback();
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
        
        // Log the action
        await db.promise().query(
            'INSERT INTO logs (user_id, action, affected_table, record_id) VALUES (?, ?, ?, ?)',
            [userId, 'delete', 'staffs', req.params.id]
        );
        
        // Commit the transaction
        await db.promise().commit();
        
        res.json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        // Rollback in case of error
        await db.promise().rollback();
        console.error('Error deleting employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting employee'
        });
    }
});

// Get dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
    const queries = {
        children: 'SELECT COUNT(*) as count FROM children',
        events: 'SELECT COUNT(*) as count FROM events',
        appointments: 'SELECT COUNT(*) as count FROM appointments',
        volunteers: 'SELECT COUNT(*) as count FROM volunteers',
        staffs: 'SELECT COUNT(*) as count FROM staffs'
    };

    const stats = {};
    let completed = 0;

    Object.entries(queries).forEach(([key, query]) => {
        db.query(query, (error, results) => {
            if (error) {
                console.error(`Error fetching ${key} count:`, error);
                res.status(500).json({ message: 'Error fetching statistics' });
                return;
            }
            stats[key] = results[0].count;
            completed++;

            if (completed === Object.keys(queries).length) {
                res.json(stats);
            }
        });
    });
});

// Get recent logs
app.get('/api/logs/recent', (req, res) => {
    const query = `
        SELECT 
            l.*,
            s.f_name as firstName,
            s.l_name as lastName,
            CASE l.affected_table
                WHEN 'children' THEN CONCAT(c.name)
                WHEN 'events' THEN e.event_name
                WHEN 'appointments' THEN a.visitor
                WHEN 'volunteers' THEN CONCAT(v.f_name, ' ', v.l_name)
                WHEN 'staffs' THEN CONCAT(s.f_name, ' ', s.l_name)
                WHEN 'inventory' THEN CONCAT(i.name)
                ELSE NULL
            END as record_name
        FROM logs l
        LEFT JOIN staffs s ON l.user_id = s.id
        LEFT JOIN children c ON l.affected_table = 'children' AND l.record_id = c.id
        LEFT JOIN events e ON l.affected_table = 'events' AND l.record_id = e.id
        LEFT JOIN appointments a ON l.affected_table = 'appointments' AND l.record_id = a.id
        LEFT JOIN volunteers v ON l.affected_table = 'volunteers' AND l.record_id = v.id
        LEFT JOIN staffs s2 ON l.affected_table = 'staffs' AND l.record_id = s2.id
        LEFT JOIN inventory i ON l.affected_table = 'inventory' AND l.record_id = i.id
        ORDER BY l.created_at DESC 
        LIMIT 10
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching logs:', error);
            res.status(500).json({ message: 'Error fetching logs' });
            return;
        }
        res.json(results);
    });
});

app.get('/api/dashboard/chart-data', (req, res) => {
    const appointmentsQuery = `
        SELECT 
            m.month_name as month,
            COALESCE(COUNT(a.id), 0) as count
        FROM (
            SELECT 'January' as month_name, 1 as month_num
            UNION SELECT 'February', 2
            UNION SELECT 'March', 3
            UNION SELECT 'April', 4
            UNION SELECT 'May', 5
            UNION SELECT 'June', 6
            UNION SELECT 'July', 7
            UNION SELECT 'August', 8
            UNION SELECT 'September', 9
            UNION SELECT 'October', 10
            UNION SELECT 'November', 11
            UNION SELECT 'December', 12
        ) m
        LEFT JOIN appointments a ON MONTH(a.visit_date) = m.month_num 
            AND YEAR(a.visit_date) = YEAR(CURDATE())
        GROUP BY m.month_name, m.month_num
        ORDER BY m.month_num
    `;

    const eventsQuery = `
        SELECT 
            m.month_name as month,
            COALESCE(COUNT(e.id), 0) as count
        FROM (
            SELECT 'January' as month_name, 1 as month_num
            UNION SELECT 'February', 2
            UNION SELECT 'March', 3
            UNION SELECT 'April', 4
            UNION SELECT 'May', 5
            UNION SELECT 'June', 6
            UNION SELECT 'July', 7
            UNION SELECT 'August', 8
            UNION SELECT 'September', 9
            UNION SELECT 'October', 10
            UNION SELECT 'November', 11
            UNION SELECT 'December', 12
        ) m
        LEFT JOIN events e ON MONTH(e.event_date) = m.month_num 
            AND YEAR(e.event_date) = YEAR(CURDATE())
        GROUP BY m.month_name, m.month_num
        ORDER BY m.month_num
    `;

    const childrenQuery = `
        SELECT YEAR(created_at) as year, COUNT(*) as count 
        FROM children 
        GROUP BY YEAR(created_at)
        ORDER BY year ASC
    `;

    db.query(appointmentsQuery, (error, appointmentsResults) => {
        if (error) {
            console.error('Error fetching appointments data:', error);
            res.status(500).json({ message: 'Error fetching chart data' });
            return;
        }

        db.query(eventsQuery, (error, eventsResults) => {
            if (error) {
                console.error('Error fetching events data:', error);
                res.status(500).json({ message: 'Error fetching chart data' });
                return;
            }

            db.query(childrenQuery, (error, childrenResults) => {
                if (error) {
                    console.error('Error fetching children data:', error);
                    res.status(500).json({ message: 'Error fetching chart data' });
                    return;
                }

                res.json({
                    appointments: appointmentsResults,
                    events: eventsResults,
                    children: childrenResults
                });
            });
        });
    });
});

// Update user profile
app.put('/api/users/:id', (req, res) => {
    const { username, f_name, l_name, password, avatar } = req.body;
    let query = 'UPDATE users SET username = ?, f_name = ?, l_name = ?';
    let params = [username, f_name, l_name];

    if (password) {
        query += ', password = ?';
        params.push(password);
    }

    if (avatar) {
        // Remove the data:image/jpeg;base64, prefix if it exists
        const base64Data = avatar.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        query += ', avatar = ?';
        params.push(buffer);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    db.query(query, params, (error, results) => {
        if (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating user'
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                username,
                f_name,
                l_name
            }
        });
    });
});

// Get user data
app.get('/api/users/:id', (req, res) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [req.params.id], (error, results) => {
        if (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Error fetching user data' });
            return;
        }
        res.json(results[0] || {});
    });
});

// Get all inventory categories
app.get('/api/inventory-categories', async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM inventory_category ORDER BY id ASC');
        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error fetching inventory categories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching inventory categories'
        });
    }
});

// Initialize inventory categories if they don't exist
app.post('/api/inventory/init-categories', async (req, res) => {
    try {
    const categories = ['Food', 'Hygiene', 'School'];
    const values = categories.map(category => [category]);
    
        await db.promise().query('INSERT IGNORE INTO inventory_category (name) VALUES ?', [values]);
        
        res.json({ 
            success: true,
            message: 'Inventory categories initialized successfully' 
        });
    } catch (error) {
            console.error('Error initializing inventory categories:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error initializing inventory categories' 
        });
    }
});

// Middleware to check inventory permission
const checkInventoryPermission = async (req, res, next) => {
    const userId = req.body.userId || req.query.userId;
    
    if (!userId) {
        return res.status(403).json({ 
            success: false,
            message: 'Access denied: Missing user ID' 
        });
    }

    const query = `
        SELECT p.* 
        FROM perms p 
        JOIN tables t ON p.table_id = t.id 
        WHERE p.user_id = ? AND t.name = 'inventory'
    `;
    
    try {
        const [results] = await db.promise().query(query, [userId]);
        if (results.length === 0) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied: You do not have permission to manage inventory' 
            });
        }
        next();
    } catch (error) {
        console.error('Error checking inventory permissions:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error checking permissions' 
        });
    }
};

// Get inventory items by category
app.get('/api/inventory/:category', checkInventoryPermission, async (req, res) => {
    const category = req.params.category.toLowerCase();
    const query = `
        SELECT i.*, ic.name as category_name 
        FROM inventory i 
        JOIN inventory_category ic ON i.category = ic.id 
        WHERE LOWER(ic.name) = ?
        ORDER BY i.name ASC
    `;
    
    try {
        const [results] = await db.promise().query(query, [category]);
        res.json({
            success: true,
            data: results
        });
    } catch (error) {
            console.error('Error fetching inventory items:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching inventory items' 
        });
    }
});

// Add new inventory item
app.post('/api/inventory', checkInventoryPermission, async (req, res) => {
    const { name, quantity, category, userId } = req.body;
    
    try {
        // Start a transaction
        await db.promise().beginTransaction();
        
        // Get the category ID
        const [categories] = await db.promise().query(
            'SELECT id FROM inventory_category WHERE LOWER(name) = ?',
            [category.toLowerCase()]
        );
        
        if (categories.length === 0) {
            await db.promise().rollback();
            return res.status(400).json({ 
                success: false,
                message: 'Invalid category' 
            });
        }
        
        const categoryId = categories[0].id;
        
        // Insert the inventory item
        const [insertResult] = await db.promise().query(
            'INSERT INTO inventory (name, quantity, category) VALUES (?, ?, ?)',
            [name, quantity, categoryId]
        );
        
        // Log the action
        await db.promise().query(
            'INSERT INTO logs (user_id, action, affected_table, record_id) VALUES (?, ?, ?, ?)',
            [userId, 'create', 'inventory', insertResult.insertId]
        );
        
        // Commit the transaction
        await db.promise().commit();
        
        res.json({ 
            success: true,
            message: 'Inventory item added successfully', 
            id: insertResult.insertId 
        });
    } catch (error) {
        // Rollback in case of error
        await db.promise().rollback();
                console.error('Error adding inventory item:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error adding inventory item' 
        });
    }
});

// Update inventory item
app.put('/api/inventory/:id', checkInventoryPermission, async (req, res) => {
    const { name, quantity, category, userId } = req.body;
    const itemId = req.params.id;
    
    try {
        // Start a transaction
        await db.promise().beginTransaction();
        
        // Get the category ID
        const [categories] = await db.promise().query(
            'SELECT id FROM inventory_category WHERE LOWER(name) = ?',
            [category.toLowerCase()]
        );
        
        if (categories.length === 0) {
            await db.promise().rollback();
            return res.status(400).json({ 
                success: false,
                message: 'Invalid category' 
            });
        }
        
        const categoryId = categories[0].id;
        
        // Update the inventory item
        const [updateResult] = await db.promise().query(
            'UPDATE inventory SET name = ?, quantity = ?, category = ? WHERE id = ?',
            [name, quantity, categoryId, itemId]
        );
        
        if (updateResult.affectedRows === 0) {
            await db.promise().rollback();
            return res.status(404).json({ 
                success: false,
                message: 'Inventory item not found' 
            });
        }
        
        // Log the action
        await db.promise().query(
            'INSERT INTO logs (user_id, action, affected_table, record_id) VALUES (?, ?, ?, ?)',
            [userId, 'update', 'inventory', itemId]
        );
        
        // Commit the transaction
        await db.promise().commit();
        
        res.json({ 
            success: true,
            message: 'Inventory item updated successfully' 
        });
    } catch (error) {
        // Rollback in case of error
        await db.promise().rollback();
        console.error('Error updating inventory item:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error updating inventory item' 
        });
    }
});

// Delete inventory item
app.delete('/api/inventory/:id', checkInventoryPermission, async (req, res) => {
    const { userId } = req.body;
    
    try {
        // Start a transaction
        await db.promise().beginTransaction();
        
        // Delete the inventory item
        const [deleteResult] = await db.promise().query(
            'DELETE FROM inventory WHERE id = ?',
            [req.params.id]
        );
        
        if (deleteResult.affectedRows === 0) {
            await db.promise().rollback();
            return res.status(404).json({ 
                success: false,
                message: 'Inventory item not found' 
            });
        }
        
        // Log the action
        await db.promise().query(
            'INSERT INTO logs (user_id, action, affected_table, record_id) VALUES (?, ?, ?, ?)',
            [userId, 'delete', 'inventory', req.params.id]
        );
        
        // Commit the transaction
        await db.promise().commit();
        
        res.json({ 
            success: true,
            message: 'Inventory item deleted successfully' 
        });
    } catch (error) {
        // Rollback in case of error
        await db.promise().rollback();
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error deleting inventory item' 
        });
    }
});

// Get upcoming children birthdays
app.get('/api/dashboard/upcoming-birthdays', (req, res) => {
    const query = `
        SELECT 
            id, 
            name, 
            date_of_birth,
            DATEDIFF(
                DATE_ADD(
                    date_of_birth,
                    INTERVAL YEAR(CURDATE()) - YEAR(date_of_birth) + 
                    IF(DAYOFYEAR(CURDATE()) > DAYOFYEAR(date_of_birth), 1, 0) YEAR
                ),
                CURDATE()
            ) as days_until_birthday,
            YEAR(CURDATE()) - YEAR(date_of_birth) + 
            IF(DAYOFYEAR(CURDATE()) > DAYOFYEAR(date_of_birth), 1, 0) as upcoming_age
        FROM children
        WHERE 
            DATEDIFF(
                DATE_ADD(
                    date_of_birth,
                    INTERVAL YEAR(CURDATE()) - YEAR(date_of_birth) + 
                    IF(DAYOFYEAR(CURDATE()) > DAYOFYEAR(date_of_birth), 1, 0) YEAR
                ),
                CURDATE()
            ) BETWEEN 0 AND 30
        ORDER BY days_until_birthday ASC
        LIMIT 10
    `;
    
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching upcoming birthdays:', error);
            res.status(500).json({ message: 'Error fetching upcoming birthdays' });
            return;
        }
        res.json(results);
    });
});

// Get upcoming events
app.get('/api/dashboard/upcoming-events', (req, res) => {
    const query = `
        SELECT 
            id, 
            event_name, 
            event_date, 
            event_description,
            DATEDIFF(event_date, CURDATE()) as days_until_event
        FROM events
        WHERE event_date >= CURDATE()
        ORDER BY event_date ASC
        LIMIT 10
    `;
    
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching upcoming events:', error);
            res.status(500).json({ message: 'Error fetching upcoming events' });
            return;
        }
        res.json(results);
    });
});

// Get children distribution data
app.get('/api/dashboard/children-distribution', (req, res) => {
    // Case category distribution
    const caseCategoryQuery = `
        SELECT 
            cc.case_category as category, 
            COUNT(c.id) as count
        FROM children c
        JOIN case_category cc ON c.case_id = cc.case_category_id
        GROUP BY cc.case_category
        ORDER BY count DESC
    `;
    
    // Educational attainment distribution
    const educationQuery = `
        SELECT 
            e.educational_attainment as education_level, 
            COUNT(c.id) as count
        FROM children c
        JOIN education e ON c.education_id = e.educational_attainment_id
        GROUP BY e.educational_attainment
        ORDER BY count DESC
    `;
    
    // Age distribution
    const ageRangeQuery = `
        SELECT
            CASE
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 0 AND 2 THEN '0-2'
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 3 AND 4 THEN '3-4'
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 5 AND 6 THEN '5-6'
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 7 AND 8 THEN '7-8'
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 9 AND 10 THEN '9-10'
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 11 AND 12 THEN '11-12'
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 13 AND 14 THEN '13-14'
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 15 AND 18 THEN '15-18'
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 19 AND 30 THEN '19-30'
                ELSE '30+'
            END as age_range,
            COUNT(*) as count
        FROM children
        GROUP BY age_range
        ORDER BY 
            CASE age_range
                WHEN '0-2' THEN 1
                WHEN '3-4' THEN 2
                WHEN '5-6' THEN 3
                WHEN '7-8' THEN 4
                WHEN '9-10' THEN 5
                WHEN '11-12' THEN 6
                WHEN '13-14' THEN 7
                WHEN '15-18' THEN 8
                WHEN '19-30' THEN 9
                ELSE 10
            END
    `;
    
    db.query(caseCategoryQuery, (error, categoryResults) => {
        if (error) {
            console.error('Error fetching case category distribution:', error);
            res.status(500).json({ message: 'Error fetching distribution data' });
            return;
        }
        
        db.query(educationQuery, (error, educationResults) => {
            if (error) {
                console.error('Error fetching education distribution:', error);
                res.status(500).json({ message: 'Error fetching distribution data' });
                return;
            }
            
            db.query(ageRangeQuery, (error, ageResults) => {
                if (error) {
                    console.error('Error fetching age distribution:', error);
                    res.status(500).json({ message: 'Error fetching distribution data' });
                    return;
                }
                
                res.json({
                    caseCategories: categoryResults,
                    educationLevels: educationResults,
                    ageRanges: ageResults
                });
            });
        });
    });
});

// Apply permission middleware to table operations
app.post('/api/:table', checkTablePermission, (req, res) => {
    // Handle POST requests for tables
    const { table } = req.params;
    const { userId, ...data } = req.body;
    
    let query;
    let values;
    
    switch(table) {
        case 'children':
            query = 'INSERT INTO children SET ?';
            values = data;
            break;
        case 'events':
            query = 'INSERT INTO events SET ?';
            values = data;
            break;
        case 'appointments':
            query = 'INSERT INTO appointments SET ?';
            values = data;
            break;
        case 'volunteers':
            query = 'INSERT INTO volunteers SET ?';
            values = data;
            break;
        case 'staffs':
            query = 'INSERT INTO staffs SET ?';
            values = data;
            break;
        case 'food':
            query = 'INSERT INTO food SET ?';
            values = data;
            break;
        case 'hygiene':
            query = 'INSERT INTO hygiene SET ?';
            values = data;
            break;
        case 'school':
            query = 'INSERT INTO school SET ?';
            values = data;
            break;
        default:
            return res.status(404).json({ message: 'Table not found' });
    }
    
    db.query(query, values, (error, results) => {
        if (error) {
            console.error(`Error adding ${table} record:`, error);
            res.status(500).json({ message: `Error adding ${table} record` });
            return;
        }
        logAction(userId, 'create', table, results.insertId);
        res.json({ message: `${table} record added successfully`, id: results.insertId });
    });
});

app.put('/api/:table/:id', checkTablePermission, (req, res) => {
    // Handle PUT requests for tables
    const { table, id } = req.params;
    const { userId, ...data } = req.body;
    
    let query;
    let values;
    
    switch(table) {
        case 'children':
            query = 'UPDATE children SET ? WHERE id = ?';
            values = [data, id];
            break;
        case 'events':
            query = 'UPDATE events SET ? WHERE id = ?';
            values = [data, id];
            break;
        case 'appointments':
            query = 'UPDATE appointments SET ? WHERE id = ?';
            values = [data, id];
            break;
        case 'volunteers':
            query = 'UPDATE volunteers SET ? WHERE id = ?';
            values = [data, id];
            break;
        case 'staffs':
            query = 'UPDATE staffs SET ? WHERE id = ?';
            values = [data, id];
            break;
        case 'food':
            query = 'UPDATE food SET ? WHERE id = ?';
            values = [data, id];
            break;
        case 'hygiene':
            query = 'UPDATE hygiene SET ? WHERE id = ?';
            values = [data, id];
            break;
        case 'school':
            query = 'UPDATE school SET ? WHERE id = ?';
            values = [data, id];
            break;
        default:
            return res.status(404).json({ message: 'Table not found' });
    }
    
    db.query(query, values, (error) => {
        if (error) {
            console.error(`Error updating ${table} record:`, error);
            res.status(500).json({ message: `Error updating ${table} record` });
            return;
        }
        logAction(userId, 'update', table, id);
        res.json({ message: `${table} record updated successfully` });
    });
});

app.delete('/api/:table/:id', checkTablePermission, (req, res) => {
    // Handle DELETE requests for tables
    const { table, id } = req.params;
    const { userId } = req.body;
    
    let query;
    
    switch(table) {
        case 'children':
            query = 'DELETE FROM children WHERE id = ?';
            break;
        case 'events':
            query = 'DELETE FROM events WHERE id = ?';
            break;
        case 'appointments':
            query = 'DELETE FROM appointments WHERE id = ?';
            break;
        case 'volunteers':
            query = 'DELETE FROM volunteers WHERE id = ?';
            break;
        case 'staffs':
            query = 'DELETE FROM staffs WHERE id = ?';
            break;
        case 'food':
            query = 'DELETE FROM food WHERE id = ?';
            break;
        case 'hygiene':
            query = 'DELETE FROM hygiene WHERE id = ?';
            break;
        case 'school':
            query = 'DELETE FROM school WHERE id = ?';
            break;
        default:
            return res.status(404).json({ message: 'Table not found' });
    }
    
    db.query(query, [id], (error) => {
        if (error) {
            console.error(`Error deleting ${table} record:`, error);
            res.status(500).json({ message: `Error deleting ${table} record` });
            return;
        }
        logAction(userId, 'delete', table, id);
        res.json({ message: `${table} record deleted successfully` });
    });
});

// Update staff profile
app.put('/api/staff/:id', (req, res) => {
    const { email, f_name, l_name, password, avatar } = req.body;
    let query = 'UPDATE staffs SET email = ?, f_name = ?, l_name = ?';
    let params = [email, f_name, l_name];

    if (password) {
        query += ', password = ?';
        params.push(password);
    }

    if (avatar) {
        // Remove the data:image/jpeg;base64, prefix if it exists
        const base64Data = avatar.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        query += ', avatar = ?';
        params.push(buffer);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    db.query(query, params, (error, results) => {
        if (error) {
            console.error('Error updating staff:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating staff'
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Staff not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                email,
                f_name,
                l_name
            }
        });
    });
});

// Get staff data
app.get('/api/staff/:id', (req, res) => {
    const query = 'SELECT * FROM staffs WHERE id = ?';
    db.query(query, [req.params.id], (error, results) => {
        if (error) {
            console.error('Error fetching staff:', error);
            res.status(500).json({ message: 'Error fetching staff data' });
            return;
        }
        res.json(results[0] || {});
    });
});

// Get all available tables
app.get('/api/tables', async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM tables ORDER BY name ASC');
        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tables'
        });
    }
});

// Get employee permissions
app.get('/api/employees/:id/permissions', async (req, res) => {
    try {
        const [results] = await db.promise().query(
            `SELECT t.id, t.name, CASE WHEN p.user_id IS NOT NULL THEN true ELSE false END as has_permission
            FROM tables t
            LEFT JOIN perms p ON t.id = p.table_id AND p.user_id = ?
            ORDER BY t.name ASC`,
            [req.params.id]
        );
        
        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error fetching employee permissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employee permissions'
        });
    }
});

// Update employee permissions
app.put('/api/employees/:id/permissions', async (req, res) => {
    const { permissions, userId: adminId } = req.body;
    const employeeId = req.params.id;
    
    try {
        // Start transaction
        await db.promise().beginTransaction();
        
        // Delete all existing permissions for the employee
        await db.promise().query('DELETE FROM perms WHERE user_id = ?', [employeeId]);
        
        // Insert new permissions
        if (permissions && permissions.length > 0) {
            const values = permissions.map(tableId => [employeeId, tableId]);
            await db.promise().query(
                'INSERT INTO perms (user_id, table_id) VALUES ?',
                [values]
            );
        }
        
        // Log the action
        await db.promise().query(
            'INSERT INTO logs (user_id, action, affected_table, record_id) VALUES (?, ?, ?, ?)',
            [adminId, 'update_permissions', 'staffs', employeeId]
        );
        
        // Commit transaction
        await db.promise().commit();
        
        res.json({
            success: true,
            message: 'Permissions updated successfully'
        });
    } catch (error) {
        // Rollback in case of error
        await db.promise().rollback();
        console.error('Error updating permissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating permissions'
        });
    }
});

app.listen(port, () => {
    console.log('Server is running on port ', port);
});