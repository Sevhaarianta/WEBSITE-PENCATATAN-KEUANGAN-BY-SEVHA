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
