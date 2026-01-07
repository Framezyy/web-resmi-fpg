import heroBg2 from '../assets/images/beritasatu.png';
import heroBg3 from '../assets/images/homesatu.png';
import heroBg4 from '../assets/images/homesatu.png';

const API_URL = 'http://localhost/web-resmi-fpg/server/api';

const DUMMY_NEWS = [
  {
    id: '1',
    title: 'Serah Terima Unit Tahap 1',
    category: 'Aktivitas',
    summary: 'Kegiatan serah terima unit kepada konsumen untuk tahap pertama.',
    location: 'Pontianak',
    publishedAt: '2025-10-12',
    coverImage: heroBg2,
    content: [
      'PT Fachri Property Group melaksanakan kegiatan serah terima unit tahap 1 kepada konsumen.',
      'Acara berjalan dengan tertib, dimulai dari proses verifikasi dokumen, pengecekan kondisi unit, hingga penandatanganan berita acara serah terima.',
      'Kami berkomitmen menjaga kualitas bangunan dan layanan purna jual agar kepuasan konsumen tetap terjaga.'
    ]
  },
  {
    id: '2',
    title: 'Progress Pembangunan Mingguan',
    category: 'Berita',
    summary: 'Update progress pembangunan proyek berjalan sesuai timeline.',
    location: 'Pontianak',
    publishedAt: '2025-11-02',
    coverImage: heroBg3,
    content: [
      'Tim lapangan melakukan monitoring dan evaluasi progress pembangunan mingguan.',
      'Fokus pekerjaan minggu ini meliputi struktur, utilitas, dan perapihan area lingkungan.',
      'Dokumentasi progress disiapkan untuk pelaporan internal dan kebutuhan stakeholder.'
    ]
  },
  {
    id: '3',
    title: 'Kegiatan Pelatihan K3',
    category: 'Aktivitas',
    summary: 'Pelatihan keselamatan kerja untuk meningkatkan budaya kerja aman.',
    location: 'Pontianak',
    publishedAt: '2025-11-15',
    coverImage: heroBg4,
    content: [
      'Pelatihan K3 dilakukan untuk meningkatkan pemahaman keselamatan kerja di area proyek.',
      'Materi mencakup penggunaan APD, prosedur kerja aman, dan penanganan keadaan darurat.',
      'Evaluasi dilakukan di akhir sesi untuk memastikan pemahaman peserta.'
    ]
  }
];

export const getNewsList = async () => {
  try {
    const res = await fetch(`${API_URL}/news-list.php`, { method: 'GET' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const getNewsById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/news-detail.php?id=${encodeURIComponent(id)}`, {
      method: 'GET'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data || null;
  } catch {
    return null;
  }
};
