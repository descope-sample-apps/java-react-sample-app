import { useState } from 'react';
import { motion } from 'framer-motion';

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const highlightJson = (value) => {
  const json = escapeHtml(JSON.stringify(value, null, 2));
  return json.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'text-[#f59e0b]';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'text-[#5cf34f]' : 'text-[#3DEFE9]';
      } else if (/true|false/.test(match)) {
        cls = 'text-[#a78bfa]';
      } else if (/null/.test(match)) {
        cls = 'text-gray-500';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
};

const FlowChip = ({ label, sub, accent }) => (
  <div
    className={`flex-1 min-w-0 px-3 py-2 rounded-lg border bg-black/40 backdrop-blur-sm ${accent}`}
  >
    <p className="text-[10px] uppercase tracking-wider text-gray-400 truncate">{label}</p>
    <p className="text-xs font-mono text-gray-200 truncate">{sub}</p>
  </div>
);

const Arrow = () => (
  <span className="text-[#5cf34f] text-lg select-none">&rarr;</span>
);

const formatExpiration = (value) => {
  if (typeof value !== 'number') return String(value);
  const ms = value > 1e12 ? value : value * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
};

const TestApiComponent = () => {
  const [status, setStatus] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setStatus(null);
    setDetails(null);
    try {
      const res = await fetch('http://localhost:8080/test_backend');
      const data = await res.json();
      if (res.ok && data.status === 'ok') {
        setStatus('success');
        setDetails(data);
      } else {
        setStatus(`failed: ${data.message || res.status}`);
        setDetails(data);
      }
    } catch (err) {
      console.error('API Error:', err);
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const isFailure = status && status.startsWith('failed');
  const isSuccess = status === 'success';

  return (
    <div className="mb-8 p-6 bg-black/20 rounded-lg border border-[#5cf34f]/20 backdrop-blur-sm max-w-2xl mx-auto text-left">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white">
          Backend API call &mdash; Descope access key exchange
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          The Java backend holds a Descope{' '}
          <a
            href="https://docs.descope.com/access-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5cf34f] underline hover:no-underline"
          >
            access key
          </a>{' '}
          and trades it for a short-lived{' '}
          <a
            href="https://docs.descope.com/authorization/session-management"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5cf34f] underline hover:no-underline"
          >
            session JWT
          </a>{' '}
          via{' '}
          <a
            href="https://docs.descope.com/api/access-keys/exchange-key"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5cf34f] underline hover:no-underline"
          >
            exchangeAccessKey
          </a>
          . The access key never leaves the server.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <FlowChip
          label="Browser"
          sub="GET /test_backend"
          accent="border-white/10"
        />
        <Arrow />
        <FlowChip
          label="Java backend"
          sub="exchangeAccessKey(...)"
          accent="border-[#5cf34f]/40"
        />
        <Arrow />
        <FlowChip
          label="Descope"
          sub="issues JWT"
          accent="border-[#3DEFE9]/40"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <code className="text-xs font-mono px-3 py-2 rounded-md bg-black/40 border border-white/10 text-gray-300 flex-1">
          <span className="text-[#5cf34f]">GET</span>{' '}
          <span className="text-gray-100">http://localhost:8080/test_backend</span>
        </code>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleTest}
          disabled={loading}
          className="px-5 py-2 bg-[#00A6B4] text-white rounded-lg hover:bg-[#00A6B4]/80 font-medium shadow-lg disabled:opacity-60 whitespace-nowrap"
        >
          {loading ? 'Calling...' : 'Run API Call'}
        </motion.button>
      </div>

      {status && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm mb-3 ${isFailure ? 'text-red-400' : 'text-[#5cf34f]'}`}
        >
          {isSuccess ? '200 OK — backend exchanged the access key' : status}
        </motion.p>
      )}

      {details && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg overflow-hidden border border-white/10 bg-black/60"
        >
          <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">
              response &mdash; application/json
            </span>
          </div>
          <pre className="text-xs leading-relaxed p-4 overflow-auto text-gray-300 font-mono text-left whitespace-pre">
            <code dangerouslySetInnerHTML={{ __html: highlightJson(details) }} />
          </pre>
          {isSuccess && (
            <div className="px-4 py-3 border-t border-white/10 bg-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">Project</p>
                <p className="text-xs font-mono text-gray-200 break-all">
                  {details.projectId || '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  Service principal
                </p>
                <p className="text-xs font-mono text-gray-200 break-all">
                  {details.subjectId || '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  Token expires
                </p>
                <p className="text-xs font-mono text-gray-200 break-all">
                  {formatExpiration(details.expiration)}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TestApiComponent;
