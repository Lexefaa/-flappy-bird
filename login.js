document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'password') {
        // Buat halaman sukses
        const container = document.querySelector('.container');
        container.innerHTML = `
            <div class="success-page">
                <h1>👋 Selamat Datang, ${username}!</h1>
                <p>Anda telah berhasil login ke sistem.</p>
                <div class="achievement">
                    <h3>🏆 Prestasi Anda:</h3>
                    <p>Berhasil menyelesaikan game Flappy Bird</p>
                </div>
                <button onclick="window.location.href='dashboard.html'" class="continue-btn">
                    Lanjutkan ke Dashboard
                </button>
            </div>
        `;
    } else {
        alert('Username atau password salah!');
    }
}); 