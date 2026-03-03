/**
 * Pakhi TVS Alwar Showroom – Shared JavaScript Utilities
 * Used across all four role pages.
 */

// ── Currency formatting (Indian number system) ─────────────────────────────

export function formatCurrency(paise) {
    if (paise == null || paise === '') return '₹0';
    const rupees = Math.round(Number(paise)) / 100;
    return '₹' + rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function formatCurrencyFloat(paise) {
    const rupees = Math.round(Number(paise || 0)) / 100;
    return '₹' + rupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Date / time helpers ────────────────────────────────────────────────────

export function formatDate(isoString) {
    if (!isoString) return '—';
    try {
        const d = new Date(isoString);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
            .replace(/\//g, '-');
    } catch { return isoString; }
}

export function formatDateTime(isoString) {
    if (!isoString) return '—';
    try {
        const d = new Date(isoString);
        const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
        return `${date} ${time}`;
    } catch { return isoString; }
}

export function timeAgo(isoString) {
    if (!isoString) return '';
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// Auto-refresh all [data-time-ago] elements every 60s
setInterval(() => {
    document.querySelectorAll('[data-time-ago]').forEach(el => {
        el.textContent = timeAgo(el.dataset.timeAgo);
    });
}, 60_000);

// ── Status badge HTML ──────────────────────────────────────────────────────

export function statusBadge(status) {
    const labels = {
        pending_approval: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        paid: 'Paid',
        exported: 'Exported',
    };
    return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
}

// ── Toast notifications ────────────────────────────────────────────────────

let _toastContainer = null;

function _getContainer() {
    if (!_toastContainer) {
        _toastContainer = document.createElement('div');
        _toastContainer.id = 'toast-container';
        document.body.appendChild(_toastContainer);
    }
    return _toastContainer;
}

export function showToast(message, type = 'info', duration = 4000) {
    const container = _getContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'none';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all .3s ease';
        setTimeout(() => toast.remove(), 350);
    }, duration);
}

// ── API helpers ────────────────────────────────────────────────────────────

export const api = {
    async get(path) {
        const res = await fetch(path);
        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(err.detail || res.statusText);
        }
        return res.json();
    },

    async post(path, body) {
        const res = await fetch(path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(err.detail || res.statusText);
        }
        return res.json();
    },

    async download(path, body, filename) {
        const res = await fetch(path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(err.detail || res.statusText);
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    },
};

// ── Server-Sent Events ─────────────────────────────────────────────────────

export function connectSSE(onEvent, onConnect) {
    let es = null;
    let retryTimer = null;
    let isFirstConnect = true;

    function connect() {
        if (es) { try { es.close(); } catch { } }
        es = new EventSource('/events');

        es.onopen = () => {
            console.log('[SSE] Connected');
            if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
            // On reconnect (not first connect), reload data to catch up on missed events
            if (!isFirstConnect && typeof onConnect === 'function') {
                console.log('[SSE] Reconnected — refreshing data…');
                onConnect();
            }
            isFirstConnect = false;
        };

        es.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                onEvent('message', data);
            } catch { }
        };

        // Handle named events
        const eventTypes = ['quotation_submitted', 'quotation_approved', 'quotation_rejected', 'quotation_paid'];
        eventTypes.forEach(type => {
            es.addEventListener(type, (e) => {
                try {
                    const data = JSON.parse(e.data);
                    onEvent(type, data);
                } catch { }
            });
        });

        es.onerror = () => {
            console.warn('[SSE] Disconnected, reconnecting in 3s…');
            es.close();
            retryTimer = setTimeout(connect, 3000);
        };
    }

    connect();
    return () => { if (es) es.close(); };
}
