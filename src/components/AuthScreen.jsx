import React from 'react';
import myLogo from '../assets/logo.png'; 
import { GoogleLogin } from '@react-oauth/google';

export default function AuthScreen({ onLoginSuccess }) {
 
  const handleSuccess = (credentialResponse) => {
    console.log("تم استلام التوكن من جوجل بنجاح، جاري إرساله للسيرفر...");

    fetch('http://161.35.25.67:5000/api/auth/google', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ token: credentialResponse.credential })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('فشل استجابة السيرفر');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        console.log("بشارة! السيرفر تحقق وحفظ البيانات بنجاح:", data.user);
        
        // 🔴 هذا هو السطر المهم الذي كان ينقصنا (حفظ الإيميل):
        localStorage.setItem('userEmail', data.user.payload.email);
        
        onLoginSuccess(); // توجيه المستخدم للوحة التحكم
      } else {
        alert("السيرفر رفض التوكن: " + data.message);
      }
    })
    .catch(error => {
      console.error("❌ خطأ في الاتصال بالسيرفر:", error);
      alert("السيرفر طافي أو هناك مشكلة في الاتصال بالباك إند!");
    });
  };

  const handleError = () => {
    console.log("❌ فشل تسجيل الدخول من قوقل");
    alert("حدث خطأ أثناء الاتصال بجوجل، يرجى المحاولة مجدداً");
  };

  return (
    <div style={styles.container}>
      <img src={myLogo} alt="Logo" style={styles.topLogo} />
      <div style={styles.glassBox}>
        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          <h2 style={styles.title}>تسجيل الدخول للنظام</h2>
          <p style={styles.subtitle}>يرجى الضغط على الزر أدناه للدخول السريع والآمن عبر حسابك</p>
          
          <div style={styles.googleBtnContainer}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="filled_blue"
              size="large"
              shape="pill"
              locale="ar"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#F3DFC3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    direction: 'rtl',
  },
  glassBox: {
    width: '400px',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    margin: '0 0 12px 0',
    color: '#333',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: '13px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  googleBtnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  topLogo: {
    position: 'absolute',
    top: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '120px',
    height: 'auto',
  },
};