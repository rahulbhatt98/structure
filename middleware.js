import { NextResponse } from "next/server";

export default function middleware(req) {
    const stepsDone = req.cookies.get("stepsDone")?.value;
    const verify = req.cookies.get("authToken")?.value;
    const profileStatus = req.cookies.get("profileStatus")?.value;
    const roleSelected = req.cookies.get("roleSelected")?.value;
    const securePath = [
        "/auth/login",
        "/auth/signup",
        "/auth/ForgetPassword",
        "/auth/reset-password",
        "/auth/Verified",
        "/Policy",
        "/TermsAndConditions",
        "/Home/professionalList",
        "/Home/serviceProvider",
        "/",
        "/blogs/allBlogs",
        "/blogs/BlogDetail"
    ];

    let professionalAdminUrl = ["/professionalProfile/addService","/tasks", "/auth/ProfessionalProfileSetup" , "/auth/professionalVefication" , "/professionalProfile", "/blogs/blogs-professional", "/blogs/professional-blog-details"]
    const professionalPath = professionalAdminUrl.includes(req.nextUrl.pathname)

    let customerUrl = ["/Home", "/dashboard", "/paymentMethods", "/Profile", "/auth/ProfileSetup" , "/professionals" , "/professionals/professionalData" , "/chats", "/Home/blogs-customer" , "/Home/customer-blog-details" , "/chats/offerPayment"]
    const customerPath = customerUrl.includes(req.nextUrl.pathname)

    const currentPath = req.nextUrl.pathname;

    // If the user is authenticated
    if (verify) {

        if (currentPath.startsWith("/Policy") || currentPath.startsWith("/chats") || currentPath.startsWith("/TermsAndConditions")) {
            return NextResponse.next();
        }
        // If the user is authenticated and the path is not secure
        if (currentPath === "/auth/ProfileSetup" && profileStatus == "true" && roleSelected === "customer") {
            return NextResponse.redirect(new URL('/Home', req.url));
        }

        if (currentPath === "/auth/ProfileSetup" && profileStatus == "true" && roleSelected === "professional") {
            return NextResponse.redirect(new URL('/tasks', req.url));
        }
        
        if (profileStatus == "false" && roleSelected === "customer" && currentPath !== "/auth/ProfileSetup") {
            return NextResponse.redirect(new URL('/auth/ProfileSetup', req.url));
        }

        if (profileStatus == "false" && roleSelected === "professional" && stepsDone === "true" && currentPath !== "/auth/professionalVefication") {
            return NextResponse.redirect(new URL('/auth/professionalVefication', req.url));
        }

        if (profileStatus == "false" && roleSelected === "professional" && (currentPath !== "/auth/ProfessionalProfileSetup" && currentPath !== "/auth/professionalVefication")) {
            return NextResponse.redirect(new URL('/auth/ProfessionalProfileSetup', req.url));
        }

        if (roleSelected === "customer" && professionalPath) {
            return NextResponse.redirect(new URL('/Home', req.url));
        }

        if (currentPath === "/auth/ProfessionalProfileSetup" && profileStatus == "true" && roleSelected === "professional") {
            return NextResponse.redirect(new URL('/tasks', req.url));
        }

        if(currentPath === "/auth/professionalVefication" && profileStatus == "true" && roleSelected === "professional" ){
            return NextResponse.redirect(new URL('/tasks', req.url));
        }

        if (roleSelected === "professional" && customerPath) {
            return NextResponse.redirect(new URL('/tasks', req.url));
        }

        if (securePath.includes(currentPath)) {
            // Redirect authenticated users away from secure paths
            if (!profileStatus && !roleSelected) {
                return NextResponse.redirect(new URL('/auth/ProfileSetup', req.url));
            } else if (!roleSelected) {
                return NextResponse.redirect(new URL('/auth/SelectedProfile', req.url));
            } else {
                return NextResponse.redirect(new URL('/Home', req.url));
            }
        }

    } else {
        // For unauthenticated users
        if (!securePath.includes(currentPath)) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/auth/:path*",
        "/Policy/:path*",
        "/TermsAndConditions/:path*",
        "/Home/:path*",
        "/Profile/:path*",
        "/paymentMethods/:path*",
        "/tasks/:path*",
        "/chats/:path*",
        "/professionalProfile/:path*",
        "/blogs/:path*",
        "/professionals/:path*"
    ]
}