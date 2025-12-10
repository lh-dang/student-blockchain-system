/**
 * Authentication Module
 * Kiểm tra quyền truy cập cho các trang admin và dean
 */

function checkAuth(requiredRole) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRole = sessionStorage.getItem('userRole');
    const loginTime = sessionStorage.getItem('loginTime');
    
    // Check if logged in
    if (!isLoggedIn || isLoggedIn !== 'true') {
        redirectToLogin();
        return false;
    }
    
    // Check session timeout (8 hours)
    const currentTime = new Date().getTime();
    const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours
    if (currentTime - parseInt(loginTime) > sessionDuration) {
        logout();
        return false;
    }
    
    // Check role permission
    // Admin và admin-students đều có quyền truy cập các trang admin
    if (requiredRole) {
        if (requiredRole === 'admin' || requiredRole === 'admin-students') {
            if (userRole !== 'admin' && userRole !== 'admin-students') {
                alert('Bạn không có quyền truy cập trang này!');
                redirectToLogin();
                return false;
            }
        } else if (requiredRole === 'dean') {
            if (userRole !== 'dean') {
                alert('Bạn không có quyền truy cập trang này!');
                redirectToLogin();
                return false;
            }
        } else if (requiredRole === 'student') {
            if (userRole !== 'student') {
                alert('Bạn không có quyền truy cập trang này!');
                redirectToLogin();
                return false;
            }
        }
    }
    
    return true;
}

function getUserInfo() {
    return {
        isLoggedIn: sessionStorage.getItem('isLoggedIn') === 'true',
        role: sessionStorage.getItem('userRole'),
        address: sessionStorage.getItem('userAddress'),
        name: sessionStorage.getItem('userName'),
        loginTime: sessionStorage.getItem('loginTime')
    };
}

function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userAddress');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('loginTime');
    sessionStorage.removeItem('studentId');
    redirectToLogin();
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function addLogoutButton() {
    const userInfo = getUserInfo();
    if (!userInfo.isLoggedIn) return;
    
    // Tìm container hoặc header để thêm nút logout
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Tạo user info bar
    const userBar = document.createElement('div');
    userBar.style.cssText = `
        background: #f8f9fa;
        padding: 10px 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-left: 4px solid #667eea;
    `;
    
    const userInfoDiv = document.createElement('div');
    
    // Hiển thị tên và MSSV cho sinh viên
    let displayName = userInfo.name;
    const studentId = sessionStorage.getItem('studentId');
    
    // Nếu là sinh viên và có studentId, kiểm tra xem userName đã có MSSV chưa
    if (userInfo.role === 'student' && studentId) {
        // Nếu userName chưa có dạng "... (MSSV)", thêm MSSV vào
        if (!userInfo.name.includes(`(${studentId})`)) {
            displayName = `${userInfo.name} (${studentId})`;
        }
    }
    
    userInfoDiv.innerHTML = `
        <strong>${displayName}</strong><br>
        <small style="font-family: monospace; color: #666;">${userInfo.address}</small>
    `;
    
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = '🚪 Đăng xuất';
    logoutBtn.style.cssText = `
        padding: 8px 16px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9em;
        font-weight: 600;
        transition: background 0.2s;
    `;
    logoutBtn.onmouseover = () => logoutBtn.style.background = '#c82333';
    logoutBtn.onmouseout = () => logoutBtn.style.background = '#dc3545';
    logoutBtn.onclick = logout;
    
    userBar.appendChild(userInfoDiv);
    userBar.appendChild(logoutBtn);
    
    // Insert at the top of container, after h1
    const h1 = container.querySelector('h1');
    if (h1 && h1.nextSibling) {
        container.insertBefore(userBar, h1.nextSibling);
    } else {
        container.insertBefore(userBar, container.firstChild);
    }
}

// Auto-check auth when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Determine required role based on page
    const path = window.location.pathname;
    let requiredRole = null;
    
    if (path.includes('admin_programs.html')) {
        requiredRole = 'admin';
    } else if (path.includes('admin_students.html')) {
        requiredRole = 'admin-students';
    } else if (path.includes('dean_students.html')) {
        requiredRole = 'dean';
    } else if (path.includes('student.html')) {
        requiredRole = 'student';
    }
    
    if (requiredRole && checkAuth(requiredRole)) {
        addLogoutButton();
    }
});
