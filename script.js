// ===============================
// LOCAL STORAGE
// ===============================

let data = JSON.parse(localStorage.getItem("transaksi")) || [];

// ===============================
// FORMAT RUPIAH
// ===============================

function rupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

// ===============================
// SIMPAN DATA
// ===============================

function simpanData() {
    localStorage.setItem("transaksi", JSON.stringify(data));
}

// ===============================
// TAMPILKAN DATA
// ===============================

function render() {

    const list = document.getElementById("list");

    let totalMasuk = 0;
    let totalKeluar = 0;

    list.innerHTML = "";

    data.forEach((item, index) => {

        if (item.jenis === "masuk") {
            totalMasuk += item.nominal;
        } else {
            totalKeluar += item.nominal;
        }

        list.innerHTML += `
        <tr>

            <td>${item.tanggal}</td>

            <td>${item.keterangan}</td>

            <td>
                <span class="badge ${item.jenis}">
                    ${item.jenis === "masuk" ? "Pemasukan" : "Pengeluaran"}
                </span>
            </td>

            <td>${rupiah(item.nominal)}</td>

            <td>
                <button class="delete" onclick="hapus(${index})">
                    Hapus
                </button>
            </td>

        </tr>
        `;

    });

    document.getElementById("masuk").textContent = rupiah(totalMasuk);
    document.getElementById("keluar").textContent = rupiah(totalKeluar);
    document.getElementById("saldo").textContent = rupiah(totalMasuk - totalKeluar);

}

// ===============================
// TAMBAH DATA
// ===============================

document.getElementById("form").addEventListener("submit", function (e) {

    e.preventDefault();

    const keterangan = document.getElementById("keterangan").value.trim();
    const nominal = Number(document.getElementById("nominal").value);
    const jenis = document.getElementById("jenis").value;

    if (keterangan === "" || nominal <= 0) {
        alert("Silakan isi data dengan benar.");
        return;
    }

    const transaksi = {

        tanggal: new Date().toLocaleDateString("id-ID"),

        keterangan: keterangan,

        nominal: nominal,

        jenis: jenis

    };

    data.push(transaksi);

    simpanData();

    render();

    this.reset();

});

// ===============================
// HAPUS DATA
// ===============================

function hapus(index) {

    if (confirm("Yakin ingin menghapus transaksi ini?")) {

        data.splice(index, 1);

        simpanData();

        render();

    }

}

// ===============================
// LOAD PERTAMA
// ===============================

render();

// ===============================
// KONFIGURASI FIREBASE (UBAH DI SINI!)
// ===============================
// Silakan ganti nilai di bawah ini dengan konfigurasi dari Firebase Console Anda sendiri
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "://firebaseapp.com",
    databaseURL: "https://console.firebase.google.com/project/catatankeuangan-77e20/database/catatankeuangan-77e20-default-rtdb/data/~2F", // <-- PASTIIN URL INI BENAR
    projectId: "catatankeuangan-xxxx",
    storageBucket: "://appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:12345:web:abcde"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let data = [];

// ===============================
// AMBIL DATA DARI FIREBASE (REALTIME)
// ===============================
// Fungsi ini akan otomatis terpanggil setiap ada perubahan data di Firebase
database.ref("transaksi").on("value", (snapshot) => {
    const firebaseData = snapshot.val();
    data = [];
    
    if (firebaseData) {
        // Mengubah objek Firebase menjadi array agar cocok dengan kode render Anda
        Object.keys(firebaseData).forEach((key) => {
            data.push({
                id: key, // kita simpan ID unik dari Firebase untuk keperluan hapus data
                ...firebaseData[key]
            });
        });
    }
    
    render();
});

// ===============================
// FORMAT RUPIAH
// ===============================
function rupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

// ===============================
// TAMPILKAN DATA
// ===============================
function render() {
    const list = document.getElementById("list");
    let totalMasuk = 0;
    let totalKeluar = 0;

    list.innerHTML = "";

    data.forEach((item) => {
        if (item.jenis === "masuk") {
            totalMasuk += item.nominal;
        } else {
            totalKeluar += item.nominal;
        }

        list.innerHTML += `
        <tr>
            <td>${item.tanggal}</td>
            <td>${item.keterangan}</td>
            <td>
                <span class="badge ${item.jenis}">
                    ${item.jenis === "masuk" ? "Pemasukan" : "Pengeluaran"}
                </span>
            </td>
            <td>${rupiah(item.nominal)}</td>
            <td>
                <!-- Fungsi hapus sekarang mengirimkan ID unik Firebase, bukan index array -->
                <button class="delete" onclick="hapus('${item.id}')">
                    Hapus
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("masuk").textContent = rupiah(totalMasuk);
    document.getElementById("keluar").textContent = rupiah(totalKeluar);
    document.getElementById("saldo").textContent = rupiah(totalMasuk - totalKeluar);
}

// ===============================
// TAMBAH DATA (SIMPAN KE FIREBASE)
// ===============================
document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const keterangan = document.getElementById("keterangan").value.trim();
    const nominal = Number(document.getElementById("nominal").value);
    const jenis = document.getElementById("jenis").value;

    if (keterangan === "" || nominal <= 0) {
        alert("Silakan isi data dengan benar.");
        return;
    }

    const transaksi = {
        tanggal: new Date().toLocaleDateString("id-ID"),
        keterangan: keterangan,
        nominal: nominal,
        jenis: jenis
    };

    // Menyimpan langsung ke Firebase menggunakan fungsi push()
    database.ref("transaksi").push(transaksi)
        .then(() => {
            this.reset();
        })
        .catch((error) => {
            alert("Gagal menyimpan data ke Firebase: " + error.message);
        });
});

// ===============================
// HAPUS DATA DARI FIREBASE
// ===============================
function hapus(id) {
    if (confirm("Yakin ingin menghapus transaksi ini?")) {
        // Menghapus data spesifik berdasarkan ID unik di Firebase
        database.ref("transaksi/" + id).remove()
            .catch((error) => {
                alert("Gagal menghapus data: " + error.message);
            });
    }
}

