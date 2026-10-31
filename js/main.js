////////////////////外部檔案/////////////////////
dayjs.extend(window.dayjs_plugin_localeData);
////////////////////工具/////////////////////
const brief = (txt, n = 80) =>
  (txt || "").replace(/\s+/g, " ").slice(0, n) +
  (txt && txt.length > n ? "…" : "");
//////////////////渲染新聞///////////////////
function renderNews(jsonPath, containerId, sourceName) {
  fetch(jsonPath)
    .then((r) => r.json())
    .then((data) => {
      const wrap = document.getElementById(containerId);
      if (!wrap) return;
      data.slice(0, 10).forEach((n, i) => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3 col-xl-5col";
        col.innerHTML = `
          <a class="text-decoration-none text-light open-reader"
             href="${n.link}"
             data-title="${(n.title || "").replace(/"/g, "&quot;")}"
             data-image="${n.image || ""}"
             data-desc="${brief(n.title, 120).replace(/"/g, "&quot;")}"
             data-date="${dayjs().format("YYYY-MM-DD HH:mm:ss")}"
             data-source="${sourceName}">
            <div class="card h-100">
              <img class="card-img-top" src="${n.image || ""}" alt="">
              <div class="card-body">
                <div class="card-title small">
                  ${n.title || ""}
                </div>
              </div>
            </div>
          </a>
        `;
        wrap.appendChild(col);
      });
    });
}
/////////////////資料來源設定/////////////////
const newsSources = [
  {
    json: "./ettoday/ettoday_data.json",
    container: "etTodayList",
    source: "ETtoday",
  },
  {
    json: "./setn/setn_data.json",
    container: "setnList",
    source: "SETN",
  },
  {
    json: "./gameapps/gameapps_data.json",
    container: "gameAppsList",
    source: "GameApps",
  },
];
//////////////初值設定載入新聞/////////////
newsSources.forEach((src) => {
  renderNews(src.json, src.container, src.source);
});
////////////////點擊→打開Modal///////////////
function handleClick(e) {
  const a = e.target.closest(".open-reader");
  if (!a) return;
  e.preventDefault();
  const title = a.dataset.title || "—";
  const date = a.dataset.date || "—";
  const image = a.dataset.image || "";
  const desc = a.dataset.desc || "（此來源未提供摘要）";
  const link = a.getAttribute("href") || "#";
  const source = a.dataset.source || new URL(link).hostname;
  ////////////////////填資料///////////////////
  document.getElementById("readerTitle").textContent = title;
  document.getElementById("readerDate").textContent = date;
  const imgEl = document.getElementById("readerImage");
  if (image) {
    imgEl.src = image;
    imgEl.style.display = "block";
  } else {
    imgEl.removeAttribute("src");
    imgEl.style.display = "none";
  }
  ///////////////////抓 DOM////////////////////
  const sumEl = document.getElementById("readerSummary");
  const btnEl = document.getElementById("readerFullBtn");
  const sourceEl = document.getElementById("readerSource");
  ////摘要(XSS(防跨站腳本攻擊)→包<p>→render)/////
  sumEl.innerHTML =
    "<p>" + desc.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</p>";
  ////////////////////其他/////////////////////
  btnEl.href = link;
  //
  sourceEl.innerHTML = `
  來源：<a href="${link}" target="_blank" rel="noopener">
    ${source || "原文"}
  </a>（僅作作品展示）
  `;
  ////////////////建立Modal物件/////////////////
  const modal = new bootstrap.Modal(document.getElementById("readerModal"));
  modal.show();
}
document.addEventListener("click", handleClick);
////////////////Message/////////////////
const API_BASE = "http://127.0.0.1:8000";
const sendBtn = document.getElementById("sendBtn");
const nameInput = document.getElementById("name");
const contentInput = document.getElementById("content");
const messageList = document.getElementById("messageList");
//POST
function postMessage() {
  const name = nameInput.value;
  const content = contentInput.value;
  console.log(name);
  console.log(content);
  //
  fetch(`${API_BASE}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      content: content,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      loadMessages();
    });
}
sendBtn.addEventListener("click", postMessage);
//DELETE
function deleteMessage(messageId, p) {
  fetch(`${API_BASE}/messages/${messageId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      p.remove();
    });
}
//GET
function loadMessages() {
  messageList.innerHTML = "";
  fetch(`${API_BASE}/messages`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      //
      data.data.forEach((message) => {
        const p = document.createElement("p");
        p.textContent = message[1] + "：" + message[2] + "：" + message[3];
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "刪除";
        deleteBtn.className = "delete-btn";
        //
        deleteBtn.addEventListener("click", () => {
          deleteMessage(message[0], p);
        });
        //
        p.appendChild(deleteBtn);
        messageList.appendChild(p);
      });
    });
}
loadMessages();
/*





































































































































*/