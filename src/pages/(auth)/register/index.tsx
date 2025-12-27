// import { useState } from "react";
// import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
// import { AuthLayout } from "@/widgets/auth-layout/ui/AuthLayout";
// import { EmailRegisterForm } from "@/features/auth/register-with-email/ui/EmailRegisterForm";
// import { VerificationRegisterForm } from "@/features/auth/register-with-email/ui/VerificationRegisterForm";
// import { PasswordRegisterForm } from "@/features/auth/register-with-email/ui/PasswordRegisterForm";
// import { CompanyInfoForm } from "@/features/auth/register-with-email/ui/CompanyInfoForm";
// import { CompanyVerificationForm } from "@/features/auth/register-with-email/ui/CompanyVerificationForm";
// import { ReviewStatus } from "@/features/auth/register-with-email/ui/ReviewStatus";

// import { GoogleLoginButton } from "@/features/auth/login-with-google/ui/GoogleLoginButton";
// import { AppleLoginButton } from "@/features/auth/login-with-apple/ui/AppleLoginButton";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/shared/ui/card";

// export const Route = createFileRoute("/(auth)/register/")({
//   component: RegisterPage,
// });

// type Step =
//   | "email"
//   | "verify-otp"
//   | "password"
//   | "company-info"
//   | "company-verify"
//   | "review";

// function RegisterPage() {
//   const [step, setStep] = useState<Step>("email");
//   const navigate = useNavigate();

//   const getTitle = () => {
//     switch (step) {
//       case "email":
//         return "Register";
//       case "verify-otp":
//         return "Enter the verification code";
//       case "password":
//         return "Create password";
//       case "company-info":
//         return "Company Information";
//       case "company-verify":
//         return "Company Verification";
//       case "review":
//         return "";
//       default:
//         return "Register";
//     }
//   };

//   const getDescription = () => {
//     switch (step) {
//       case "verify-otp":
//         return "We’ve sent a 6-digit code to your email. Please enter it below to verify your account.";
//       case "password":
//         return "Create a strong password to keep your account safe";
//       case "company-verify":
//         return "Confirm your organization to unlock all platform features.";
//       default:
//         return null;
//     }
//   };

//   const isReviewStep = step === "review";
//   // For Step 6, we might not render the CardHeader at all, or let component handle it.
//   // Based on design, Step 6 "Under review" Card looks slightly different (width, style).
//   // But for simplicity, we can reuse the Card with hidden Header.

//   const iswideStep = step === "company-info";

//   return (
//     <AuthLayout>
//       <Card
//         className={`w-full bg-white p-6 border-none shadow-none sm:border sm:rounded-[16px] sm:shadow-lg transition-all duration-300 ${
//           iswideStep ? "max-w-[940px]" : "max-w-[480px]"
//         }`}
//       >
//         {!isReviewStep && (
//           <CardHeader className="p-0 space-y-1 text-center sm:text-left mb-2">
//             <CardTitle className="text-2xl font-bold text-[#202224]">
//               {getTitle()}
//             </CardTitle>
//             {getDescription() && (
//               <p className="text-sm text-[#666C72] font-normal">
//                 {getDescription()}
//               </p>
//             )}
//             {step === "company-info" && null}
//           </CardHeader>
//         )}

//         <CardContent className="p-0 mt-0 space-y-5">
//           {step === "email" && (
//             <>
//               <EmailRegisterForm onSuccess={() => setStep("verify-otp")} />

//               <div className="relative opacity-80">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t border-gray-200" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="bg-white px-2 text-[#666C72]">or</span>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <GoogleLoginButton />
//                 <AppleLoginButton />
//               </div>
//             </>
//           )}

//           {step === "verify-otp" && (
//             <VerificationRegisterForm onSuccess={() => setStep("password")} />
//           )}

//           {step === "password" && (
//             <PasswordRegisterForm onSuccess={() => setStep("company-info")} />
//           )}

//           {step === "company-info" && (
//             <CompanyInfoForm onSuccess={() => setStep("company-verify")} />
//           )}

//           {step === "company-verify" && (
//             <CompanyVerificationForm onSuccess={() => setStep("review")} />
//           )}

//           {step === "review" && (
//             <ReviewStatus onNext={() => navigate({ to: "/" })} />
//           )}
//         </CardContent>

//         {step === "email" && (
//           <CardFooter className="p-0 mt-4 justify-center text-sm text-[#202224] gap-1">
//             <span>Don&apos;t have an account?</span>
//             <Link
//               to="/login"
//               className="font-bold text-[#60A5FA] hover:underline"
//             >
//               Login
//             </Link>
//           </CardFooter>
//         )}
//       </Card>
//     </AuthLayout>
//   );
// }
