
// ===============================
// KONFIGURASI FIREBASE
// ===============================

const firebaseConfig = {
    apiKey: "ISI_API_KEY",
    authDomain: "ISI_AUTH_DOMAIN",
    databaseURL: "ISI_DATABASE_URL",
    projectId: "ISI_PROJECT_ID",
    storageBucket: "ISI_STORAGE_BUCKET",
    messagingSenderId: "ISI_MESSAGING_SENDER_ID",
    appId: "ISI_APP_ID"
};

// ===============================
// INISIALISASI FIREBASE
// ===============================

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const transaksiRef = database.ref("transaksi");

let data = [];

// ===============================
// FORMAT RUPIAH
// ===============================

function rupiah(angka) {
    return "Rp " + Number(angka).toLocaleString("id-ID");
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
            totalMasuk += Number(item.nominal);
        } else {
            totalKeluar += Number(item.nominal);
        }

        list.innerHTML += `
        <tr>
            <td>${item.tanggal}</td>
            <td>${escapeHTML(item.keterangan)}</td>

            <td>
                <span class="badge ${item.jenis}">
                    ${item.jenis === "masuk" ? "Pemasukan" : "Pengeluaran"}
                </span>
            </td>

            <td>${rupiah(item.nominal)}</td>

            <td>
                <button onclick="edit('${item.id}')">
                    Edit
                </button>

                <button class="delete" onclick="hapus('${item.id}')">
                    Hapus
                </button>
            </td>
        </tr>
        `;

    });

    document.getElementById("masuk").textContent = rupiah(totalMasuk);

    document.getElementById("keluar").textContent = rupiah(totalKeluar);

    document.getElementById("saldo").textContent =
        rupiah(totalMasuk - totalKeluar);
}

// ===============================
// AMANKAN TAMPILAN TEKS
// ===============================

function escapeHTML(teks) {
    return String(teks).replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}

// ===============================
// AMBIL DATA REALTIME
// ===============================

transaksiRef.on("value", (snapshot) => {

    const firebaseData = snapshot.val();

    data = [];

    if (firebaseData) {

        Object.entries(firebaseData).forEach(([key, value]) => {

            data.push({
                id: key,
                ...value
            });

        });

    }

    render();

}, (error) => {

    alert("Gagal mengambil data: " + error.message);

});

// ===============================
// TAMBAH TRANSAKSI
// ===============================

document.getElementById("form").addEventListener("submit", function(e) {

    e.preventDefault();

    const keterangan =
        document.getElementById("keterangan").value.trim();

    const nominal =
        Number(document.getElementById("nominal").value);

    const jenis =
        document.getElementById("jenis").value;

    if (!keterangan || !Number.isSafeInteger(nominal) || nominal <= 0) {

        alert("Silakan isi data dengan benar.");

        return;
    }

    const transaksi = {

        tanggal: new Date().toLocaleDateString("id-ID"),

        keterangan: keterangan,

        nominal: nominal,

        jenis: jenis

    };

    transaksiRef.push(transaksi)
        .then(() => {

            this.reset();

        })
        .catch((error) => {

            alert("Gagal menyimpan: " + error.message);

        });

});

// ===============================
// EDIT TRANSAKSI
// ===============================

function edit(id) {

    const item = data.find((transaksi) => transaksi.id === id);

    if (!item) return;

    const keteranganBaru = prompt(
        "Ubah keterangan:",
        item.keterangan
    );

    if (keteranganBaru === null) return;

    if (!keteranganBaru.trim()) {
        alert("Keterangan tidak boleh kosong.");
        return;
    }

    const nominalBaru = prompt(
        "Ubah nominal:",
        item.nominal
    );

    if (nominalBaru === null) return;

    const nominal = Number(nominalBaru);

    if (!Number.isSafeInteger(nominal) || nominal <= 0) {
        alert("Nominal tidak valid.");
        return;
    }

    const jenisBaru = prompt(
        "Jenis transaksi: masuk / keluar",
        item.jenis
    );

    if (jenisBaru === null) return;

    if (!["masuk", "keluar"].includes(jenisBaru)) {
        alert("Jenis transaksi tidak valid.");
        return;
    }

    transaksiRef.child(id).update({

        keterangan: keteranganBaru.trim(),

        nominal: nominal,

        jenis: jenisBaru

    }).catch((error) => {

        alert("Gagal mengedit: " + error.message);

    });

}

// ===============================
// HAPUS TRANSAKSI
// ===============================

function hapus(id) {

    if (!confirm("Yakin ingin menghapus transaksi ini?")) {
        return;
    }

    transaksiRef.child(id).remove()
        .catch((error) => {

            alert("Gagal menghapus: " + error.message);

        });

}
