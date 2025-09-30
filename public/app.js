const out = document.getElementById('output');

async function loadSchedule() {
    try {
        const resp = await fetch('/api/schedule');
        if (!resp.ok) throw new Error('Network response was not ok: ' + resp.status);
        const data = await resp.json();
        out.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        out.textContent = 'Error: ' + err.message;
    }
}

loadSchedule();