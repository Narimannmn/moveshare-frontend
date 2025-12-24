import { Mail, Trash, Plus, Download, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "./Button";

/**
 * ButtonDemo - Comprehensive showcase of all Button component variants
 *
 * This component demonstrates all possible combinations:
 * - Variants: primary, danger, secondary, ghost, outline
 * - Sizes: sm, default, lg
 * - States: normal, disabled, loading
 * - With prefix/postfix icons
 */
export const ButtonDemo = () => {
  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "32px", fontSize: "24px", fontWeight: "bold" }}>
        Button Component - Design System
      </h1>

      {/* Variants */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Button Variants
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <Button variant="primary">Button</Button>
          <Button variant="danger">Button</Button>
          <Button variant="secondary">Button</Button>
          <Button variant="ghost">Button</Button>
          <Button variant="outline">Button</Button>
        </div>
      </section>

      {/* Sizes */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Button Sizes
        </h2>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* States */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Button States
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </section>

      {/* With Icons */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Buttons with Icons
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <Button prefix={<Mail />}>Send Email</Button>
          <Button variant="danger" prefix={<Trash />}>
            Delete
          </Button>
          <Button variant="ghost" prefix={<Plus />}>
            Add New
          </Button>
          <Button variant="outline" postfix={<Download />}>
            Download
          </Button>
          <Button prefix={<ArrowLeft />} variant="secondary">
            Back
          </Button>
          <Button postfix={<ArrowRight />}>Next</Button>
        </div>
      </section>

      {/* Full Width */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Full Width Buttons
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Button fullWidth>Full Width Primary</Button>
          <Button fullWidth variant="danger">
            Full Width Danger
          </Button>
          <Button fullWidth variant="outline" prefix={<Mail />}>
            Full Width with Icon
          </Button>
        </div>
      </section>

      {/* Real-world Examples */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Real-world Examples
        </h2>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "500" }}>
            Form Actions
          </h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button>Submit</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "500" }}>
            Confirmation Dialog
          </h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button variant="danger" prefix={<Trash />}>
              Delete Account
            </Button>
            <Button variant="ghost">Keep Account</Button>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "500" }}>
            Pagination
          </h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button variant="outline" size="sm" prefix={<ArrowLeft />}>
              Previous
            </Button>
            <Button variant="outline" size="sm" postfix={<ArrowRight />}>
              Next
            </Button>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "500" }}>
            Call to Action
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
            <Button size="lg" fullWidth>
              Get Started
            </Button>
            <Button size="lg" fullWidth variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* All Variant + Size Combinations */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Complete Variant × Size Matrix
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {/* Primary */}
          <Button variant="primary" size="sm">
            Primary Small
          </Button>
          <Button variant="primary" size="default">
            Primary Default
          </Button>
          <Button variant="primary" size="lg">
            Primary Large
          </Button>

          {/* Danger */}
          <Button variant="danger" size="sm">
            Danger Small
          </Button>
          <Button variant="danger" size="default">
            Danger Default
          </Button>
          <Button variant="danger" size="lg">
            Danger Large
          </Button>

          {/* Secondary */}
          <Button variant="secondary" size="sm">
            Secondary Small
          </Button>
          <Button variant="secondary" size="default">
            Secondary Default
          </Button>
          <Button variant="secondary" size="lg">
            Secondary Large
          </Button>

          {/* Ghost */}
          <Button variant="ghost" size="sm">
            Ghost Small
          </Button>
          <Button variant="ghost" size="default">
            Ghost Default
          </Button>
          <Button variant="ghost" size="lg">
            Ghost Large
          </Button>

          {/* Outline */}
          <Button variant="outline" size="sm">
            Outline Small
          </Button>
          <Button variant="outline" size="default">
            Outline Default
          </Button>
          <Button variant="outline" size="lg">
            Outline Large
          </Button>
        </div>
      </section>

      {/* Disabled States */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Disabled States (All Variants)
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <Button variant="primary" disabled>
            Primary Disabled
          </Button>
          <Button variant="danger" disabled>
            Danger Disabled
          </Button>
          <Button variant="secondary" disabled>
            Secondary Disabled
          </Button>
          <Button variant="ghost" disabled>
            Ghost Disabled
          </Button>
          <Button variant="outline" disabled>
            Outline Disabled
          </Button>
        </div>
      </section>

      {/* Loading States */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Loading States (All Variants)
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <Button variant="primary" loading>
            Loading
          </Button>
          <Button variant="danger" loading>
            Deleting
          </Button>
          <Button variant="secondary" loading>
            Processing
          </Button>
          <Button variant="ghost" loading>
            Saving
          </Button>
          <Button variant="outline" loading>
            Uploading
          </Button>
        </div>
      </section>

      {/* Interactive Demo */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>
          Interactive Examples
        </h2>

        <div style={{ padding: "16px", backgroundColor: "#F5F6FA", borderRadius: "8px" }}>
          <p style={{ fontSize: "14px", marginBottom: "12px", color: "#666C72" }}>
            Click buttons to see hover and active states:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Button onClick={() => alert("Primary clicked!")}>Click Me</Button>
            <Button variant="danger" onClick={() => alert("Danger clicked!")}>
              Delete
            </Button>
            <Button variant="outline" prefix={<Mail />} onClick={() => alert("Email sent!")}>
              Send Email
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
