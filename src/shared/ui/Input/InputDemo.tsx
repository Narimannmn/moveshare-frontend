import { Mail, Lock, Search, User } from "lucide-react";
import { Input } from "./Input";

/**
 * InputDemo - Comprehensive showcase of all Input component variants
 *
 * This component demonstrates all possible combinations:
 * - States: default, error, focused, disabled
 * - Label: with/without
 * - BG: with/without background
 * - Prefix/Postfix: icons or text before/after input
 */
export const InputDemo = () => {
  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "32px", fontSize: "24px", fontWeight: "bold" }}>
        Input Component - Design System
      </h1>

      {/* Basic Examples */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Basic States
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Input
            label="Label"
            placeholder="Example text"
            helperText="Example: toleb.aibatyrov@gmail.com"
          />

          <Input
            label="With Error"
            placeholder="Example text"
            error="toleb.aibatyrov@gmail.com"
          />

          <Input
            label="Disabled"
            placeholder="Example text"
            disabled
            defaultValue="Disabled input"
          />

          <Input
            label="Focused State"
            placeholder="Example text"
            state="focused"
            helperText="This input has focused styling"
          />
        </div>
      </section>

      {/* Background Variants */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Background Variants
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Input
            label="With Background (default)"
            placeholder="Example text"
            bg={true}
            helperText="BG=true"
          />

          <Input
            label="Without Background"
            placeholder="Example text"
            bg={false}
            helperText="BG=false"
          />
        </div>
      </section>

      {/* Prefix/Postfix Variants */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Prefix & Postfix
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Input
            label="With Prefix Icon"
            placeholder="Search..."
            prefix={<Search />}
            helperText="Icon before input"
          />

          <Input
            label="With Postfix Icon"
            placeholder="Enter email"
            postfix={<Mail />}
            helperText="Icon after input"
          />

          <Input
            label="Both Prefix & Postfix"
            placeholder="Enter username"
            prefix={<User />}
            postfix={<Lock />}
            helperText="Icons on both sides"
          />

          <Input
            label="No Prefix/Postfix"
            placeholder="Type here"
            helperText="Default (no icons)"
          />
        </div>
      </section>

      {/* Without Label */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Without Label
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Input
            placeholder="No label, with background"
            helperText="Label=false, BG=true"
          />

          <Input
            placeholder="No label, no background"
            bg={false}
            helperText="Label=false, BG=false"
          />

          <Input
            placeholder="Search with icon"
            prefix={<Search />}
          />
        </div>
      </section>

      {/* Real-world Examples */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Real-world Examples
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Email Input */}
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            prefix={<Mail />}
            helperText="We'll never share your email"
          />

          {/* Password Input */}
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            prefix={<Lock />}
            helperText="Minimum 8 characters"
          />

          {/* Username Input */}
          <Input
            label="Username"
            placeholder="Choose a username"
            prefix={<User />}
            helperText="Only letters, numbers, and underscores"
          />

          {/* Search Input */}
          <Input
            placeholder="Search jobs..."
            prefix={<Search />}
            bg={false}
          />
        </div>
      </section>

      {/* All State Combinations */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Complete Variant Matrix
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Default + BG + No Icon */}
          <Input
            label="Default, BG, No Icon"
            placeholder="Text"
            bg={true}
            helperText="State=Default"
          />

          {/* Default + No BG + No Icon */}
          <Input
            label="Default, No BG"
            placeholder="Text"
            bg={false}
            helperText="State=Default"
          />

          {/* Error + BG + Prefix */}
          <Input
            label="Error, BG, Prefix"
            placeholder="Text"
            bg={true}
            prefix={<Mail />}
            error="This field is required"
          />

          {/* Disabled + BG + Postfix */}
          <Input
            label="Disabled, BG, Postfix"
            placeholder="Text"
            bg={true}
            postfix={<Search />}
            disabled
            defaultValue="Disabled text"
          />
        </div>
      </section>

      {/* React Hook Form Integration Example */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          React Hook Form Integration
        </h2>

        <div style={{ padding: "16px", backgroundColor: "#F5F6FA", borderRadius: "8px" }}>
          <p style={{ fontSize: "14px", marginBottom: "12px", color: "#666C72" }}>
            Use with React Hook Form:
          </p>
          <pre style={{ fontSize: "12px", fontFamily: "monospace", overflow: "auto" }}>
{`<Controller
  name="email"
  control={control}
  render={({ field, fieldState }) => (
    <Input
      {...field}
      label="Email"
      prefix={<Mail />}
      error={fieldState.error?.message}
    />
  )}
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
};
