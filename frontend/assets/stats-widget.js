/**
 * Pakhi TVS Alwar Showroom – Shared Stats Widget
 * Loaded as a plain script (not ES module) so it works on all pages.
 * Usage: initStatsWidget('container-element-id')
 */
(function () {
    'use strict';

    const RANK = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

    /* ── Formatters ────────────────────────────────────────────────────────── */
    function fmtLakh(paise) {
        const r = Math.round((paise || 0) / 100);
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
            '<div class="sw-lb-header">' +
            '  <span class="sw-lb-title">🏆 Sales Leaderboard</span>' +
            '  <span class="sw-lb-legend">' +
            '    <span class="sw-pipe sw-pipe-pending">🟡 Pending</span>' +
            '    <span class="sw-pipe sw-pipe-approved">✅ Approved</span>' +
            '    <span class="sw-pipe sw-pipe-paid">💰 Collected</span>' +
            '  </span>' +
            '</div>' +
            '<div class="sw-lb-list" id="sw-lb">' + skeletonHTML() + '</div>' +
            '<div class="sw-awaiting-wrap" id="sw-awaiting" style="display:none"></div>' +
            '</div>';
    }

    /* ── Render stats cards (6 cards: 4 period-filtered + 2 all-time pipeline) */
    function renderStats(data) {
        var el = document.getElementById('sw-stats');
        if (!el) return;
        var pendClass = (data.pending_approvals > 0) ? ' sw-stat-amber' : '';
        var apprClass = (data.approved_amount > 0) ? ' sw-stat-blue' : '';
        el.innerHTML =
            // Row 1: period-filtered numbers
            '<div class="sw-stat-card">' +
            '<div class="sw-stat-num">' + (data.total_sales || 0) + '</div>' +
            '<div class="sw-stat-lbl">💰 Sales</div>' +
            '</div>' +
            '<div class="sw-stat-card">' +
            '<div class="sw-stat-num">' + fmtLakh(data.total_revenue || 0) + '</div>' +
            '<div class="sw-stat-lbl">Revenue</div>' +
            '</div>' +
            '<div class="sw-stat-card">' +
            '<div class="sw-stat-num">' + fmtLakh(data.total_discounts || 0) + '</div>' +
            '<div class="sw-stat-lbl">Discounts</div>' +
            '</div>' +
            // Row 2: all-time pipeline (always visible regardless of period filter)
            '<div class="sw-stat-card' + pendClass + '">' +
            '<div class="sw-stat-num">' + fmtLakh(data.pending_approval_amount || 0) + '</div>' +
            '<div class="sw-stat-lbl">🟡 Pending ₹ <span class="sw-stat-sub">(all-time)</span></div>' +
            '</div>' +
            '<div class="sw-stat-card' + apprClass + '">' +
            '<div class="sw-stat-num">' + fmtLakh(data.approved_amount || 0) + '</div>' +
            '<div class="sw-stat-lbl">✅ Approved ₹ <span class="sw-stat-sub">(uncollected)</span></div>' +
            '</div>' +
            '<div class="sw-stat-card">' +
            '<div class="sw-stat-num">' + (data.pending_approvals || 0) + '</div>' +
            '<div class="sw-stat-lbl">⏳ Pending Count</div>' +
            '</div>';
    }

    /* ── Render leaderboard with pipeline columns ───────────────────────────── */
    function renderLeaderboard(board) {
        var el = document.getElementById('sw-lb');
        if (!el) return;
        if (!board || !board.length) {
            el.innerHTML = '<div class="sw-empty">No activity yet for this period</div>';
            return;
        }
        el.innerHTML = board.slice(0, 5).map(function (rep, i) {
            var paid = rep.paid_count || rep.sales_count || rep.count || 0;
            var approved = rep.approved_count || 0;
            var pending = rep.pending_count || 0;
            var revenue = rep.total_value || rep.total || 0;
            var pipeline =
                '<span class="sw-pipe sw-pipe-pending">🟡 ' + pending + '</span>' +
                '<span class="sw-pipe sw-pipe-approved">✅ ' + approved + '</span>' +
                '<span class="sw-pipe sw-pipe-paid">💰 ' + paid + '</span>';
            return '<div class="sw-lb-row">' +
                '<span class="sw-lb-rank">' + (RANK[i] || (i + 1)) + '</span>' +
                '<span class="sw-lb-emoji">' + (rep.rep_emoji || rep.emoji || '👤') + '</span>' +
                '<span class="sw-lb-name">' + (rep.rep_name || rep.name || '') + '</span>' +
                '<span class="sw-lb-pipeline">' + pipeline + '</span>' +
                '<span class="sw-lb-rev">' + (paid > 0 ? fmtLakh(revenue) : '') + '</span>' +
                '</div>';
        }).join('');
    }

    /* ── Render "Awaiting Approval" section ─────────────────────────────────── */
    function renderAwaiting(reps) {
        var el = document.getElementById('sw-awaiting');
        if (!el) return;
        if (!reps || !reps.length) {
            el.style.display = 'none';
            return;
        }
        el.style.display = '';
        el.innerHTML =
            '<div class="sw-awaiting-title">⏳ Awaiting Your Approval</div>' +
            reps.map(function (r) {
                return '<div class="sw-awaiting-row">' +
                    '<span class="sw-awaiting-who">' + (r.rep_emoji || '👤') + ' ' + r.rep_name + '</span>' +
                    '<span class="sw-awaiting-detail">' + r.count + ' quote' + (r.count > 1 ? 's' : '') + ' · ' + fmtLakh(r.amount) + '</span>' +
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
                renderAwaiting(data.reps_with_pending || []);
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
