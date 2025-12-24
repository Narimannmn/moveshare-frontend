import { useState } from "react";
import { OTPInput } from "./OTPInput";

/**
 * OTPInputDemo - Comprehensive showcase of all OTPInput component variants
 *
 * This component demonstrates all possible combinations:
 * - Lengths: 4 digits, 6 digits
 * - States: default, error, success
 * - Sizes: default, sm
 */
export const OTPInputDemo = () => {
  const [otp6, setOtp6] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [otpSmall, setOtpSmall] = useState("");

  const handleComplete = (value: string) => {
    console.log("OTP Complete:", value);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "32px", fontSize: "24px", fontWeight: "bold" }}>
        OTP Input Component - Design System
      </h1>

      {/* Basic 6-digit OTP */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          6-Digit OTP (Default)
        </h2>

        <OTPInput
          label="Enter verification code"
          value={otp6}
          onChange={setOtp6}
          onComplete={handleComplete}
          length={6}
          helperText="We sent a code to your phone"
        />

        <div style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}>
          Current value: <strong>{otp6 || "(empty)"}</strong>
        </div>
      </section>

      {/* 4-digit OTP */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          4-Digit OTP
        </h2>

        <OTPInput
          label="Enter PIN"
          value={otp4}
          onChange={setOtp4}
          onComplete={handleComplete}
          length={4}
          helperText="Enter your 4-digit PIN"
        />

        <div style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}>
          Current value: <strong>{otp4 || "(empty)"}</strong>
        </div>
      </section>

      {/* States */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          States
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Default State */}
          <div>
            <h3
              style={{
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#666",
              }}
            >
              Default State
            </h3>
            <OTPInput
              value=""
              onChange={() => {}}
              length={6}
              state="default"
              helperText="Enter the code"
            />
          </div>

          {/* Error State */}
          <div>
            <h3
              style={{
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#666",
              }}
            >
              Error State
            </h3>
            <OTPInput
              value={otpError}
              onChange={setOtpError}
              length={6}
              state="error"
              error="Invalid code. Please try again."
            />
          </div>

          {/* Success State */}
          <div>
            <h3
              style={{
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#666",
              }}
            >
              Success State
            </h3>
            <OTPInput
              value={otpSuccess}
              onChange={setOtpSuccess}
              length={6}
              state="success"
              helperText="Code verified successfully!"
            />
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>Sizes</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Default Size */}
          <div>
            <h3
              style={{
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#666",
              }}
            >
              Default Size (48×56px)
            </h3>
            <OTPInput
              value=""
              onChange={() => {}}
              length={6}
              size="default"
              helperText="Large size for desktop"
            />
          </div>

          {/* Small Size */}
          <div>
            <h3
              style={{
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#666",
              }}
            >
              Small Size (40×40px)
            </h3>
            <OTPInput
              value={otpSmall}
              onChange={setOtpSmall}
              length={6}
              size="sm"
              helperText="Compact size for mobile"
            />
          </div>
        </div>
      </section>

      {/* Real-world Examples */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Real-world Examples
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Phone Verification */}
          <div
            style={{
              padding: "24px",
              backgroundColor: "#F5F6FA",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "16px", fontWeight: "600" }}>
              Phone Verification
            </h3>
            <p style={{ marginBottom: "16px", fontSize: "14px", color: "#666" }}>
              We sent a 6-digit code to +1 (555) 123-4567
            </p>
            <OTPInput
              label="Verification Code"
              value=""
              onChange={() => {}}
              onComplete={(value) => {
                alert(`Code submitted: ${value}`);
              }}
              length={6}
              helperText="Didn't receive code? Resend in 30s"
            />
          </div>

          {/* 2FA Authentication */}
          <div
            style={{
              padding: "24px",
              backgroundColor: "#F5F6FA",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "16px", fontWeight: "600" }}>
              Two-Factor Authentication
            </h3>
            <p style={{ marginBottom: "16px", fontSize: "14px", color: "#666" }}>
              Enter the 6-digit code from your authenticator app
            </p>
            <OTPInput
              label="Authentication Code"
              value=""
              onChange={() => {}}
              onComplete={(value) => {
                console.log("2FA code:", value);
              }}
              length={6}
            />
          </div>

          {/* PIN Entry */}
          <div
            style={{
              padding: "24px",
              backgroundColor: "#F5F6FA",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "16px", fontWeight: "600" }}>
              PIN Entry
            </h3>
            <p style={{ marginBottom: "16px", fontSize: "14px", color: "#666" }}>
              Enter your 4-digit security PIN
            </p>
            <OTPInput
              label="Security PIN"
              value=""
              onChange={() => {}}
              onComplete={(value) => {
                console.log("PIN entered:", value);
              }}
              length={4}
              size="sm"
            />
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Interactive Demo
        </h2>

        <div
          style={{
            padding: "24px",
            backgroundColor: "#F5F6FA",
            borderRadius: "8px",
          }}
        >
          <p style={{ marginBottom: "16px", fontSize: "14px", color: "#666" }}>
            Try typing in the input below. It will automatically validate when complete.
          </p>

          <OTPInput
            label="Enter Code"
            value=""
            onChange={(value) => {
              console.log("Value changed:", value);
            }}
            onComplete={(value) => {
              if (value === "123456") {
                alert("✅ Correct code!");
              } else {
                alert("❌ Incorrect code. Try 123456");
              }
            }}
            length={6}
            helperText="Hint: Try entering 123456"
          />
        </div>
      </section>

      {/* Complete Variant Matrix */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Complete Variant Matrix
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* 6-digit Default */}
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "13px", color: "#666" }}>
              6-digit, Default, Large
            </h4>
            <OTPInput value="" onChange={() => {}} length={6} state="default" size="default" />
          </div>

          {/* 6-digit Small */}
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "13px", color: "#666" }}>
              6-digit, Default, Small
            </h4>
            <OTPInput value="" onChange={() => {}} length={6} state="default" size="sm" />
          </div>

          {/* 4-digit Default */}
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "13px", color: "#666" }}>
              4-digit, Default, Large
            </h4>
            <OTPInput value="" onChange={() => {}} length={4} state="default" size="default" />
          </div>

          {/* 4-digit Small */}
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "13px", color: "#666" }}>
              4-digit, Default, Small
            </h4>
            <OTPInput value="" onChange={() => {}} length={4} state="default" size="sm" />
          </div>

          {/* Error Large */}
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "13px", color: "#666" }}>
              6-digit, Error, Large
            </h4>
            <OTPInput
              value=""
              onChange={() => {}}
              length={6}
              state="error"
              size="default"
              error="Invalid code"
            />
          </div>

          {/* Success Large */}
          <div>
            <h4 style={{ marginBottom: "8px", fontSize: "13px", color: "#666" }}>
              6-digit, Success, Large
            </h4>
            <OTPInput
              value=""
              onChange={() => {}}
              length={6}
              state="success"
              size="default"
              helperText="Verified!"
            />
          </div>
        </div>
      </section>

      {/* React Hook Form Integration */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          React Hook Form Integration
        </h2>

        <div
          style={{
            padding: "16px",
            backgroundColor: "#F5F6FA",
            borderRadius: "8px",
          }}
        >
          <p style={{ fontSize: "14px", marginBottom: "12px", color: "#666C72" }}>
            Use with React Hook Form:
          </p>
          <pre
            style={{
              fontSize: "12px",
              fontFamily: "monospace",
              overflow: "auto",
            }}
          >
            {`<Controller
  name="otp"
  control={control}
  render={({ field, fieldState }) => (
    <OTPInput
      {...field}
      length={6}
      error={fieldState.error?.message}
      onComplete={(value) => {
        // Validate OTP
        verifyOTP(value);
      }}
    />
  )}
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
};
