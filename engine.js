let tabs = [{ content: "<h1>Witaj w Domestos Browser</h1>" }];
let activeTabIndex = 0;

function newTab() {
    tabs.push({ content: "<h1>Nowa karta</h1>" });
    renderTabs();
    switchTab(tabs.length - 1);
}

function switchTab(index) {
    activeTabIndex = index;
    renderTabs();
    document.getElementById('viewport').innerHTML = tabs[index].content;
}

function renderTabs() {
    const tabBar = document.getElementById('tab-bar');
    tabBar.innerHTML = '';
    tabs.forEach((tab, i) => {
        const div = document.createElement('div');
        div.className = `tab ${i === activeTabIndex ? 'active' : ''}`;
        div.innerText = `Karta ${i + 1}`;
        div.onclick = () => switchTab(i);
        tabBar.appendChild(div);
    });
    tabBar.innerHTML += '<button onclick="newTab()">+</button>';
}

function loadUrl() {
    const val = document.getElementById('url-bar').value;
    tabs[activeTabIndex].content = val; // Zapisuje "kod" do karty
    document.getElementById('viewport').innerHTML = val;
}
