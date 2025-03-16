// Check if user has permission to access a specific table
export const hasTablePermission = (tableName) => {
    const permissions = JSON.parse(sessionStorage.getItem('permissions') || '[]');
    return permissions.includes(tableName);
};

// Get all user permissions
export const getUserPermissions = () => {
    return JSON.parse(sessionStorage.getItem('permissions') || '[]');
};

// Check if user has any permissions
export const hasAnyPermissions = () => {
    const permissions = JSON.parse(sessionStorage.getItem('permissions') || '[]');
    return permissions.length > 0;
}; 