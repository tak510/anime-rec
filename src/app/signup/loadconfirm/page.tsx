'use client'

export default function loadingConfirmPage() {

    return (
        <div className="min-h-screen">
          <p className="text-emerald-400 text-xl text-center p-10">
            Signup successful! Please check your email to confirm your address.
          </p>

          <p className="text-center">If you did not receive an email, confirm that the input email address is correct, check your spam/junk mail, or 
            click the button below to resend the confirmation!</p>
          
          <button type="button">Resend Confirmation</button>
        </div>
    )
}