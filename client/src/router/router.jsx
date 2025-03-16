import Login from '../components/admin/Login';
import Dashboard from '../components/admin/Dashboard';
import Records from '../components/admin/Records';
import Calendar from '../components/admin/Calendar';
import Staffs from '../components/admin/Staffs';
import Inventory from '../components/admin/Inventory';

import Home from '../components/public/Home';
import AboutUs from '../components/public/AboutUs';
import Donate from '../components/public/Donate';
import Contact from '../components/public/Contact';
import ProjectReadMore from '../components/public/ProjectReadMore';
import RCLWLearnMore from '../components/public/RCLWLearnMore';
import KCPLearnMore from '../components/public/KCPLearnMore';
import NACCLearnMore from '../components/public/NACCLearnMore';

import Error from '../components/Error';

export const routes = [
    {
        path: "/",
        element: <Home />,
        errorElement: <Error />
    },
    {
        path: "/AboutUs",
        element: <AboutUs />,
        errorElement: <Error />
    },
    {
        path: "/Donate",
        element: <Donate />,
        errorElement: <Error />
    },
    {
        path: "/Contact",
        element: <Contact />,
        errorElement: <Error />
    },
    {
        path: "/ProjectReadMore",
        element: <ProjectReadMore />,
        errorElement: <Error />
    },
    {
        path: "/RCLWLearnMore",
        element: <RCLWLearnMore />,
        errorElement: <Error />
    },
    {
        path: "/KCPLearnMore",
        element: <KCPLearnMore />,
        errorElement: <Error />
    },
    {
        path: "/NACCLearnMore",
        element: <NACCLearnMore />,
        errorElement: <Error />
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <Error />
    },
    {
        path: "dashboard",
        element: <Dashboard />,
        errorElement: <Error />,
    },
    {
        path: "records",
        element: <Records />,
        errorElement: <Error />,
    },
    {
        path: "staffs",
        element: <Staffs />,
        errorElement: <Error />,
    },
    {
        path: "calendar",
        element: <Calendar />,
        errorElement: <Error />,
    },
    {
        path: "inventory",
        element: <Inventory />,
        errorElement: <Error />,
    },
];