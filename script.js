/* =====================
   共通スクリプト
   ===================== */

// フォントサイズ切り替え
function applySize(size) {
  document.body.style.fontSize = size + "px";
}

// 行間切り替え
function applyLineHeight(lh) {
  document.body.style.lineHeight = lh;
}

// ページトップに戻るボタンの表示/非表示
function handleScroll() {
  const topBtn = document.querySelector("#top-btn");
  if (!topBtn) return;
  if (window.scrollY > 200) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
}

// 初期化処理
document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js loaded ✅");

  // サイズ選択
  const sizeSelect = document.querySelector("#font-size");
  if (sizeSelect) {
    sizeSelect.addEventListener("change", (e) => {
      applySize(e.target.value);
    });
  }

  // 行間選択
  const lhSelect = document.querySelector("#line-height");
  if (lhSelect) {
    lhSelect.addEventListener("change", (e) => {
      applyLineHeight(e.target.value);
    });
  }

  // スクロールでトップボタンの挙動制御
  window.addEventListener("scroll", handleScroll);

  // トップに戻るボタン動作
  const topBtn = document.querySelector("#top-btn");
  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
