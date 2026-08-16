import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, RefreshCw, Terminal, CheckCircle, AlertCircle } from "lucide-react";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import { selectApiConfig, setApiLogsOpen, clearApiLogs } from "../apiConfigSlice";
import { formatDateTime } from "../../../utils/formatters";

export const ApiLogsModal = () => {
  const dispatch = useDispatch();
  const { isApiLogsOpen, useMockApi, baseUrl } = useSelector(selectApiConfig);
  const [logs, setLogs] = useState([]);

  const loadLogs = () => {
    try {
      const data = localStorage.getItem("laravel_api_request_logs");
      if (data) {
        setLogs(JSON.parse(data));
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    }
  };

  useEffect(() => {
    if (isApiLogsOpen) {
      loadLogs();
      const handleCustomEvent = (e) => {
        setLogs((prev) => [e.detail, ...prev.slice(0, 49)]);
      };
      window.addEventListener("laravel_api_log", handleCustomEvent);
      return () => window.removeEventListener("laravel_api_log", handleCustomEvent);
    }
  }, [isApiLogsOpen]);

  if (!isApiLogsOpen) return null;

  return (
    <Modal
      id="api-logs-modal"
      isOpen={isApiLogsOpen}
      onClose={() => dispatch(setApiLogsOpen(false))}
      maxWidth="max-w-4xl"
      title="Laravel HTTP Request & Response Telemetry"
      subtitle={`Inspecting API calls across ${useMockApi ? "Mock Sandbox" : `Live Endpoint (${baseUrl})`}`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Total Captured Requests: <strong className="text-slate-800 dark:text-slate-200">{logs.length}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              id="refresh-logs-btn"
              variant="secondary"
              size="sm"
              onClick={loadLogs}
              leftIcon={RefreshCw}
            >
              Refresh
            </Button>
            <Button
              type="button"
              id="clear-logs-btn"
              variant="danger"
              size="sm"
              onClick={() => {
                dispatch(clearApiLogs());
                setLogs([]);
              }}
              leftIcon={Trash2}
            >
              Clear Logs
            </Button>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No API requests captured yet.</p>
            <p className="mt-1 text-2xs">Perform actions like creating tasks or filtering to see real-time HTTP exchanges.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {logs.map((log) => {
              const isSuccess = log.status >= 200 && log.status < 300;
              const isValidation = log.status === 422;
              return (
                <div
                  key={log.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs text-slate-800 dark:text-slate-200"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 font-sans">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-3xs ${
                          log.method === "GET"
                            ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                            : log.method === "POST"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : log.method === "PUT"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : log.method === "PATCH"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {log.method}
                      </span>
                      <span className="font-mono text-xs font-semibold">{log.endpoint}</span>
                    </div>

                    <div className="flex items-center gap-2 text-2xs text-slate-400 font-sans">
                      <span>{formatDateTime(log.timestamp)}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                          isSuccess
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : isValidation
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                        }`}
                      >
                        {isSuccess ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        HTTP {log.status}
                      </span>
                    </div>
                  </div>

                  {/* Payload or Query Params */}
                  {log.payload && (
                    <div className="mt-1 text-2xs text-slate-500 dark:text-slate-400 overflow-x-auto">
                      <span className="text-slate-400 font-bold">Payload/Query:</span>{" "}
                      <code>{JSON.stringify(log.payload)}</code>
                    </div>
                  )}

                  {/* Response Summary */}
                  {log.response && (
                    <div className="mt-1 text-2xs text-slate-600 dark:text-slate-300 overflow-x-auto">
                      <span className="text-slate-400 font-bold">Response:</span>{" "}
                      <code>{JSON.stringify(log.response)}</code>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ApiLogsModal;
