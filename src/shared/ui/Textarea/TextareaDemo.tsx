import { Textarea } from "./Textarea";

/**
 * TextareaDemo - Comprehensive showcase of all Textarea component variants
 *
 * This component demonstrates all possible combinations:
 * - States: default, error, focused, disabled
 * - Label: with/without
 * - BG: with/without background
 */
export const TextareaDemo = () => {
  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "32px", fontSize: "24px", fontWeight: "bold" }}>
        Textarea Component - Design System
      </h1>

      {/* Basic Examples */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Basic States
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Textarea
            label="Label"
            placeholder="Describe the job requirements"
            helperText="Example: The job requires excellent communication skills and experience with React."
          />

          <Textarea
            label="With Error"
            placeholder="Describe the job requirements"
            error="This field is required"
          />

          <Textarea
            label="Disabled"
            placeholder="Describe the job requirements"
            disabled
            defaultValue="This textarea is disabled and cannot be edited."
          />

          <Textarea
            label="Focused State"
            placeholder="Describe the job requirements"
            state="focused"
            helperText="This textarea has focused styling"
          />
        </div>
      </section>

      {/* Background Variants */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Background Variants
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Textarea
            label="With Background (default)"
            placeholder="Describe the job requirements"
            bg={true}
            helperText="BG=true"
          />

          <Textarea
            label="Without Background"
            placeholder="Describe the job requirements"
            bg={false}
            helperText="BG=false"
          />
        </div>
      </section>

      {/* Without Label */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Without Label
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Textarea
            placeholder="No label, with background"
            helperText="Label=false, BG=true"
          />

          <Textarea
            placeholder="No label, no background"
            bg={false}
            helperText="Label=false, BG=false"
          />
        </div>
      </section>

      {/* Real-world Examples */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Real-world Examples
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Job Description */}
          <Textarea
            label="Job Description"
            placeholder="Describe the job requirements, responsibilities, and qualifications..."
            helperText="Provide a detailed description of the job"
            rows={6}
          />

          {/* Cover Letter */}
          <Textarea
            label="Cover Letter"
            placeholder="Write your cover letter here..."
            helperText="Max 500 words"
            rows={8}
          />

          {/* Comments/Feedback */}
          <Textarea
            label="Additional Comments"
            placeholder="Any additional information you'd like to share..."
            helperText="Optional"
            rows={4}
          />

          {/* Bio */}
          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            helperText="Maximum 200 characters"
            rows={4}
            maxLength={200}
          />
        </div>
      </section>

      {/* All State Combinations */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Complete Variant Matrix
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Default + BG */}
          <Textarea
            label="Default, BG"
            placeholder="Text"
            bg={true}
            helperText="State=Default"
            rows={3}
          />

          {/* Default + No BG */}
          <Textarea
            label="Default, No BG"
            placeholder="Text"
            bg={false}
            helperText="State=Default"
            rows={3}
          />

          {/* Error + BG */}
          <Textarea
            label="Error, BG"
            placeholder="Text"
            bg={true}
            error="This field is required"
            rows={3}
          />

          {/* Disabled + BG */}
          <Textarea
            label="Disabled, BG"
            placeholder="Text"
            bg={true}
            disabled
            defaultValue="Disabled text"
            rows={3}
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
  name="description"
  control={control}
  render={({ field, fieldState }) => (
    <Textarea
      {...field}
      label="Job Description"
      placeholder="Describe the job..."
      error={fieldState.error?.message}
      rows={6}
    />
  )}
/>`}
          </pre>
        </div>
      </section>

      {/* Resizable Demo */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Resizable Textarea
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Textarea
            label="Resizable (default)"
            placeholder="You can resize this textarea vertically..."
            helperText="Drag the bottom-right corner to resize"
            rows={4}
          />
        </div>
      </section>
    </div>
  );
};
