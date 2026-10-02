// Semua konten ada di sini. Tambah item baru tanpa mengubah logika game.
const MATERI = [
  {emoji:"🧩", judul:"Algoritma", isi:"Algoritma adalah langkah berurutan untuk menyelesaikan masalah, misalnya resep membuat teh.", kode:"1. Rebus air\n2. Masukkan teh\n3. Tuang ke gelas"},
  {emoji:"📦", judul:"Variabel & Tipe Data", isi:"Variabel adalah kotak berlabel untuk menyimpan data: angka (int), teks (str), atau benar/salah (bool).", kode:"umur = 15        # int\nnama = \"Rina\"    # str\nsiswa = True     # bool"},
  {emoji:"🐍", judul:"Python Dasar", isi:"Python mudah dibaca. print() menampilkan data, input() meminta data dari pengguna.", kode:"nama = \"Rina\"\nprint(\"Halo\", nama)"},
  {emoji:"🔁", judul:"Perulangan", isi:"Perulangan menjalankan perintah berkali-kali tanpa menulis ulang kodenya.", kode:"for i in range(3):\n    print(i)"},
  {emoji:"🔀", judul:"Percabangan", isi:"Percabangan memilih aksi berdasarkan kondisi benar atau salah.", kode:"if nilai >= 75:\n    print(\"Lulus\")\nelse:\n    print(\"Coba lagi\")"},
  {emoji:"⚖️", judul:"Logika Boolean", isi:"AND benar jika keduanya benar, OR benar jika salah satunya benar, NOT membalik nilai.", kode:"True and False  # False\nTrue or False   # True\nnot True        # False"},
  {emoji:"🌐", judul:"HTML, CSS, JS", isi:"HTML menyusun isi halaman, CSS mempercantik tampilan, JavaScript membuatnya interaktif. Coba di Lab kode!", kode:"<h1>Halo</h1>\nh1{color:hotpink}\nalert('Hai!')"},
  {emoji:"🔢", judul:"Bilangan Biner", isi:"Komputer memakai 0 dan 1. Nilai posisi bit dari kanan ke kiri: 1, 2, 4, 8, 16, 32, 64, 128.", kode:"101 = 4 + 0 + 1 = 5"}
];

const SOAL_PYTHON = [
  {kode:"print(2 + 3 * 4)", opsi:["20","14","24","9"], benar:1, info:"Perkalian dikerjakan lebih dulu: 3*4=12, lalu 2+12=14."},
  {kode:"x = \"Hai\"\nprint(x * 2)", opsi:["HaiHai","Hai2","Hai Hai","Error"], benar:0, info:"String dikali angka akan diulang."},
  {kode:"for i in range(3):\n    print(i, end=\" \")", opsi:["1 2 3","0 1 2","0 1 2 3","3 2 1"], benar:1, info:"range(3) menghasilkan 0, 1, 2."},
  {kode:"a = [1, 2, 3]\nprint(len(a))", opsi:["2","4","3","6"], benar:2, info:"len() menghitung jumlah elemen list."},
  {kode:"n = 7\nif n % 2 == 0:\n    print(\"Genap\")\nelse:\n    print(\"Ganjil\")", opsi:["Genap","Ganjil","7","Error"], benar:1, info:"7 dibagi 2 bersisa 1, jadi ganjil."},
  {kode:"print(10 // 3, 10 % 3)", opsi:["3 1","3.3 1","1 3","3 3"], benar:0, info:"// adalah pembagian bulat, % adalah sisa bagi."},
  {kode:"print(True and not False)", opsi:["True","False","None","Error"], benar:0, info:"not False menjadi True, jadi True and True = True."},
  {kode:"x = 5\nx += 2\nprint(x * 2)", opsi:["10","12","14","7"], benar:2, info:"x menjadi 7, lalu 7 * 2 = 14."}
];

const SUSUN = [
  {judul:"Cetak 0 sampai 2 (Python)", baris:["for i in range(3):","    print(i)"]},
  {judul:"Cek kelulusan (Python)", baris:["if nilai >= 75:","    print(\"Lulus\")","else:","    print(\"Coba lagi\")"]},
  {judul:"Jumlah 1 sampai 3 (JavaScript)", baris:["let total = 0;","for (let i = 1; i <= 3; i++) {","  total += i;","}","console.log(total);"]}
];

const MEMORI = [["Variabel","x = 5"],["Perulangan","for i in range(3):"],["Percabangan","if x > 3:"],["List","[1, 2, 3]"],["Fungsi","def halo():"],["Biner 5","00000101"]];

const LAB = [
  {nama:"Sapa dunia", tujuan:"Tantangan: ubah warna judul menjadi hotpink dan teks tombol menjadi namamu.", kode:"<h1>Halo Dunia</h1>\n<button onclick=\"this.textContent='Terima kasih!'\">Klik aku</button>\n<style>\n  body{font-family:sans-serif;text-align:center;padding:2rem}\n  h1{color:teal}\n</style>"},
  {nama:"Lampu ajaib", tujuan:"Tantangan: tambahkan warna ketiga ke dalam daftar warna.", kode:"<div id=\"lampu\" style=\"width:120px;height:120px;border-radius:50%;margin:2rem auto;background:gray\"></div>\n<script>\n  const warna = ['gold','hotpink'];\n  let i = 0;\n  document.getElementById('lampu').onclick = e => {\n    e.target.style.background = warna[i++ % warna.length];\n  };\n<\/script>"},
  {nama:"Penghitung", tujuan:"Tantangan: ubah agar setiap klik menambah 5.", kode:"<h1 id=\"n\" style=\"text-align:center;font:700 4rem sans-serif\">0</h1>\n<p style=\"text-align:center\"><button id=\"b\">+1</button></p>\n<script>\n  let n = 0;\n  b.onclick = () => { n += 1; document.getElementById('n').textContent = n; };\n<\/script>"}
];

const HERO = [
  {bahasa:"Python", kode:"nama = \"Dunia\"\nfor i in range(3):\n    print(\"Halo\", nama)", out:"Halo Dunia ×3 ✓"},
  {bahasa:"JavaScript", kode:"const skor = [80, 95, 70];\nconsole.log(Math.max(...skor));", out:"95 ✓"},
  {bahasa:"HTML + CSS", kode:"<h1>Halo!</h1>\nh1 { color: hotpink; }", out:"Judul pink tampil ✓"}
];

const BADGES = [
  {id:"mulai", emoji:"🌱", nama:"Langkah pertama", desk:"Dapatkan XP pertamamu"},
  {id:"baca", emoji:"📚", nama:"Pembaca rajin", desk:"Pahami semua kartu materi"},
  {id:"python", emoji:"🐍", nama:"Ahli Python", desk:"Tebak Output tanpa salah"},
  {id:"biner", emoji:"🤖", nama:"Pendekar biner", desk:"Skor 100 di Biner Cepat"},
  {id:"susun", emoji:"🧱", nama:"Arsitek kode", desk:"Selesaikan 3 puzzle Susun Kode"},
  {id:"memori", emoji:"🃏", nama:"Detektif memori", desk:"Cocokkan semua kartu"},
  {id:"lab", emoji:"🧪", nama:"Ilmuwan kode", desk:"Jalankan kode di Lab"},
  {id:"lv5", emoji:"👑", nama:"Raja koding", desk:"Capai Level 5"}
];
