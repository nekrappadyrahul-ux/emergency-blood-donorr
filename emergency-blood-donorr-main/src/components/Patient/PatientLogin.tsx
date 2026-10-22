import React, { useState } from 'react';
import { useBloodConnect } from '../../context/BloodConnectContext';
import { ShieldCheck, ArrowRight, Phone } from 'lucide-react';

interface PatientLoginProps {
  onSuccess: () => void;
}

export const PatientLogin: React.FC<PatientLoginProps> = ({ onSuccess }) => {
  const { loginPatient } = useBloodConnect();
  const [phoneNumber, setPhoneNumber] = useState('9845011223');
  const [patientName, setPatientName] = useState('Priya Sharma');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['1', '2', '3', '4']);
  const [isSending, setIsSending] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    loginPatient(`+91 ${phoneNumber}`, patientName || 'Patient');
    onSuccess();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
      {/* Brand Header */}
      <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="w-14 h-14 mx-auto mb-3 bg-red-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-red-500/25">
          🩸
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          BloodConnect
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Instant emergency blood & verified donor network
        </p>
      </div>

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Patient / Attendant Name
            </label>
            <input
              id="patient-login-name-input"
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-500 font-semibold text-sm">
                +91
              </span>
              <input
                id="patient-login-phone-input"
                type="tel"
                required
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-mono tracking-wider focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              We will send a 4-digit verification code
            </p>
          </div>

          <button
            id="patient-send-otp-btn"
            type="submit"
            disabled={isSending || phoneNumber.length < 10}
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md shadow-red-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isSending ? (
              <span>Sending OTP...</span>
            ) : (
              <>
                <span>Send OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
          <div className="text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Enter the 4-digit code sent to
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
              +91 {phoneNumber}
            </p>
          </div>

          <div className="flex justify-center gap-3 my-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`patient-otp-input-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const val = e.target.value;
                  const newOtp = [...otp];
                  newOtp[idx] = val;
                  setOtp(newOtp);
                }}
                className="w-12 h-14 text-center text-xl font-bold font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              />
            ))}
          </div>

          <p className="text-center text-xs text-slate-500">
            Demo default code: <span className="font-mono font-bold text-red-600">1234</span>
          </p>

          <button
            id="patient-verify-otp-btn"
            type="submit"
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md shadow-red-500/25 flex items-center justify-center gap-2 transition"
          >
            Verify & Enter App
          </button>

          <button
            type="button"
            onClick={() => setStep('phone')}
            className="w-full text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1"
          >
            ← Change Phone Number
          </button>
        </form>
      )}
    </div>
  );
};
