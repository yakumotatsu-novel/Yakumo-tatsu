// === URLパラメータから本文読み込み ===
const params = new URLSearchParams(window.location.search);
const work = params.get("work");

if (work) {
  const path = `episodes/${work}.html`;
  fetch(path)
    .then(res => {
      if (!res.ok) throw new Error("HTTPエラー " + res.status);
      return res.text();
    })
    .then(html => {
      document.getElementById("content").innerHTML = html;

      // ✅ slugからWORKSを探してtitleを表示
      const workData = WORKS.find(w => w.slug === work);
      if (workData) {
        document.getElementById("work-title").textContent = workData.title;
        document.getElementById("chapter-title").textContent = workData.title;
      } else {
        const fallbackTitle = work.replace(/_/g, " ");
        document.getElementById("work-title").textContent = fallbackTitle;
        document.getElementById("chapter-title").textContent = fallbackTitle;
      }

      // ✅ 段落ジャンプボタン生成処理
      const contentDiv = document.getElementById("content");
      const tocDiv = document.getElementById("toc");
      tocDiv.innerHTML = ""; // 初期化

      const sections = contentDiv.querySelectorAll("section");
      sections.forEach((sec, i) => {
        sec.id = `p${i+1}`;
        const btn = document.createElement("button");
        btn.textContent = `段落 ${i+1}`;
        btn.addEventListener("click", () => {
          const headerHeight = document.getElementById("header").offsetHeight || 100;
          const top = sec.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
          window.scrollTo({ top, behavior: "smooth" });
        });
        tocDiv.appendChild(btn);
      });
    })
    .catch(err => {
      document.getElementById("content").innerHTML =
        "本文を読み込めませんでした。<br>" + err.message;
    });
} else {
  document.getElementById("content").innerHTML = "作品が指定されていません。";
}

// === 英訳ON/OFF切り替え ===
function toggleEnglish() {
  const enParts = document.querySelectorAll('.translation');
  if (!enParts.length) return;

  const currentlyVisible = !enParts[0].classList.contains('hidden-translation');
  enParts.forEach(el => {
    el.classList.toggle('hidden-translation');
  });

  document.getElementById("toggleEN").textContent =
    currentlyVisible ? 'ENG ON (SPACE)' : 'ENG OFF (SPACE)';
}

document.getElementById("toggleEN").addEventListener('click', toggleEnglish);

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    toggleEnglish();
  }
});

// === フォントサイズ ===
const FONT_SIZES = ["14px", "16px", "18px", "20px", "24px"];
const FONT_LABELS = ["XS", "Small", "Normal", "Large", "XL"];
let currentFontIndex = 2; // Normal(18px)から開始

function applyFontSize() {
  const content = document.getElementById("content");
  content.style.fontSize = FONT_SIZES[currentFontIndex];
  document.getElementById("font-label").textContent = FONT_LABELS[currentFontIndex];
}

document.getElementById("smallerBtn").addEventListener("click", () => {
  if (currentFontIndex > 0) {
    currentFontIndex--;
    applyFontSize();
  }
});
document.getElementById("largerBtn").addEventListener("click", () => {
  if (currentFontIndex < FONT_SIZES.length - 1) {
    currentFontIndex++;
    applyFontSize();
  }
});

applyFontSize();
