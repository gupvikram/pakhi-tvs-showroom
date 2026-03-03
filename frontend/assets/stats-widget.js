/**
 * Pakhi TVS Alwar Showroom – Shared Stats Widget
 * Loaded as a plain script (not ES module) so it works on all pages.
 * Usage: initStatsWidget('container-element-id')
 */
(function () {
    'use strict';

    const RANK = ['🥇', '🥈', '🥉', '4️⃣'];

    /* ── Formatters ────────────────────────────────────────────────────────── */
    function fmtLakh(paise) {
        const r = Math.round((paise || 0) / 100);
        if (r >= 1000000) return '₹' + (r / 100000).toFixed(1) + 'L';
        if (r >= 100000) return '₹' + (r / 100000).toFixed(1) + 'L';
        if (r >= 1000) return '₹' + (r / 1000).toFixed(1) + 'K';
        return '₹' + r.toLocaleString('en-IN');
    }

    /* ── State ─────────────────────────────────────────────────────────────── */
    var _containerId = null;
    var _period = 'today';
    var _sse = null;
    var _sseRetry = null;

    /* ── Skeleton markup ────────────────────────────────────────────────────── */
    function skeletonHTML() {
        return '<div class="sw-skeleton-row">' +
            '<div class="sw-skeleton"></div><div class="sw-skeleton"></div>' +
            '<div class="sw-skeleton"></div><div class="sw-skeleton"></div>' +
            '</div>';
    }

    /* ── Full widget HTML ───────────────────────────────────────────────────── */
    function mountWidget(container) {
        container.innerHTML =
            '<div class="sw-card">' +
            '<div class="sw-tabs" id="sw-tabs">' +
            '<button class="sw-tab active" data-period="today"  onclick="swPeriod(\'today\',this)">Today</button>' +
            '<button class="sw-tab"        data-period="week"   onclick="swPeriod(\'week\',this)">This Week</button>' +
            '<button class="sw-tab"        data-period="month"  onclick="swPeriod(\'month\',this)">This Month</button>' +
            '</div>' +
            '<div class="sw-stats-grid" id="sw-stats">' + skeletonHTML() + '</div>' +
            '<div class="sw-lb-title">🏆 Sales Leaderboard</div>' +
            '<div class="sw-lb-list" id="sw-lb">' + skeletonHTML() + '</div>' +
            '</div>';
    }

    /* ── Render stats cards ─────────────────────────────────────────────────── */
    function renderStats(data) {
        var el = document.getElementById('sw-stats');
        if (!el) return;
        var pendClass = (data.pending_approvals > 0) ? ' sw-stat-amber' : '';
        el.innerHTML =
            '<div class="sw-stat-card">' +
            '<div class="sw-stat-num">' + (data.total_sales || 0) + '</div>' +
            '<div class="sw-stat-lbl">Sales</div>' +
            '</div>' +
            '<div class="sw-stat-card">' +
            '<div class="sw-stat-num">' + fmtLakh(data.total_revenue || 0) + '</div>' +
            '<div class="sw-stat-lbl">Revenue</div>' +
            '</div>' +
            '<div class="sw-stat-card">' +
            '<div class="sw-stat-num">' + fmtLakh(data.total_discounts || 0) + '</div>' +
            '<div class="sw-stat-lbl">Discounts Given</div>' +
            '</div>' +
            '<div class="sw-stat-card' + pendClass + '">' +
            '<div class="sw-stat-num">' + (data.pending_approvals || 0) + '</div>' +
            '<div class="sw-stat-lbl">Pending Approval</div>' +
            '</div>';
    }

    /* ── Render leaderboard ─────────────────────────────────────────────────── */
    function renderLeaderboard(board) {
        var el = document.getElementById('sw-lb');
        if (!el) return;
        if (!board || !board.length) {
            el.innerHTML = '<div class="sw-empty">No sales yet for this period</div>';
            return;
        }
        el.innerHTML = board.slice(0, 4).map(function (rep, i) {
            return '<div class="sw-lb-row">' +
                '<span class="sw-lb-rank">' + (RANK[i] || (i + 1)) + '</span>' +
                '<span class="sw-lb-emoji">' + (rep.rep_emoji || '👤') + '</span>' +
                '<span class="sw-lb-name">' + (rep.rep_name || rep.name || '') + '</span>' +
                '<span class="sw-lb-meta">' +
                '<b>' + (rep.sales_count || rep.count || 0) + '</b> sold &nbsp;' +
                fmtLakh(rep.total_value || rep.total || 0) +
                '</span>' +
                '</div>';
        }).join('');
    }

    /* ── Fetch and render ───────────────────────────────────────────────────── */
    function fetchAndRender(period) {
        fetch('/stats?date=' + period)
            .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
            .then(function (data) {
                renderStats(data);
                renderLeaderboard(data.leaderboard || data.rep_leaderboard || []);
            })
            .catch(function () {
                var el = document.getElementById('sw-stats');
                if (el) el.innerHTML = '<div class="sw-error">Could not load stats. Retrying…</div>';
            });
    }

    /* ── Period tab click (global so onclick= works) ────────────────────────── */
    window.swPeriod = function (period, btn) {
        _period = period;
        document.querySelectorAll('.sw-tab').forEach(function (t) { t.classList.remove('active'); });
        if (btn) btn.classList.add('active');
        fetchAndRender(period);
    };

    /* ── SSE auto-refresh ───────────────────────────────────────────────────── */
    function connectSSE() {
        if (_sse) { try { _sse.close(); } catch (e) { } }
        _sse = new EventSource('/events');
        ['quotation_submitted', 'quotation_approved', 'quotation_paid'].forEach(function (type) {
            _sse.addEventListener(type, function () { fetchAndRender(_period); });
        });
        _sse.onerror = function () {
            _sse.close();
            _sseRetry = setTimeout(connectSSE, 5000);
        };
    }

    /* ── Public init ────────────────────────────────────────────────────────── */
    window.initStatsWidget = function (containerId) {
        _containerId = containerId;
        var el = document.getElementById(containerId);
        if (!el) return;
        mountWidget(el);
        fetchAndRender('today');
        connectSSE();
    };

    /* ── Expose refresh for pages that want manual refresh ──────────────────── */
    window.refreshStatsWidget = function () {
        fetchAndRender(_period);
    };

})();
