let menu = JSON.parse(localStorage.getItem('restaurantMenu')) || [];
let cart = [];

// Hiển thị/Ẩn khu vực quản lý
function toggleAdmin() {
    const admin = document.getElementById('admin-section');
    admin.style.display = admin.style.display === 'none' ? 'block' : 'none';
}

// Thêm món ăn mới (Lưu ảnh dạng Base64 để không cần server)
function addItem() {
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    const imageFile = document.getElementById('itemImage').files[0];

    if (name && price && imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newItem = {
                id: Date.now(),
                name: name,
                price: parseInt(price),
                image: e.target.result
            };
            menu.push(newItem);
            localStorage.setItem('restaurantMenu', JSON.stringify(menu));
            renderMenu();
            alert("Đã thêm món thành công!");
        };
        reader.readAsDataURL(imageFile);
    }
}

// Hiển thị thực đơn ra màn hình
function renderMenu() {
    const container = document.getElementById('menu-container');
    container.innerHTML = menu.map(item => `
        <div class="card">
            <img src="${item.image}" width="100%">
            <h3>${item.name}</h3>
            <p>${item.price.toLocaleString()} VNĐ</p>
            <button onclick="addToCart(${item.id})">Thêm vào giỏ</button>
            <button class="btn-delete" onclick="deleteItem(${item.id})">Xóa</button>
        </div>
    `).join('');
}

// Thêm vào giỏ hàng
function addToCart(id) {
    const item = menu.find(m => m.id === id);
    cart.push(item);
    updateCart();
}

// Xử lý đặt hàng và hiện mã QR
function processOrder() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const phone = document.getElementById('customerPhone').value;
    
    if (total === 0 || !phone) {
        alert("Vui lòng chọn món và nhập SĐT!");
        return;
    }

    // Tạo link QR VietQR (Thay STK và Ngân hàng của bạn vào đây)
    // Cấu trúc: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-template.png?amount=<AMOUNT>&addInfo=<INFO>
    const bankID = "MB"; // Ví dụ: MB, VCB, ICB...
    const accountNo = "0123456789"; // Số tài khoản của bạn
    const qrUrl = `https://img.vietqr.io/image/${bankID}-${accountNo}-compact.png?amount=${total}&addInfo=DonHang_${phone}`;
    
    document.getElementById('qr-container').innerHTML = `<img src="${qrUrl}" alt="QR Thanh toán">`;
    document.getElementById('qr-section').style.display = 'block';
    
    alert("Đơn hàng đã được ghi nhận! Vui lòng quét mã QR để thanh toán.");
}

function deleteItem(id) {
    menu = menu.filter(item => item.id !== id);
    localStorage.setItem('restaurantMenu', JSON.stringify(menu));
    renderMenu();
}

// Chạy hiển thị lần đầu
renderMenu();
