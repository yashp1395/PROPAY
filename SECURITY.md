# Security Configuration Guide for EquiPay

## ⚠️ IMPORTANT: Secret Keys Management

This document outlines how to securely configure your EquiPay application with proper secret management.

## 🔑 Required Environment Variables

### Database Configuration
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=payroll_system
DB_USERNAME=your_db_username
DB_PASSWORD=your_secure_database_password_here
```

### JWT Configuration
```bash
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-256-bits-please-change-this
JWT_EXPIRATION=86400000
```

### Google Gemini AI Configuration
```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Email Configuration (Optional)
```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## 🚀 Setup Instructions

### 1. Create Environment File
Copy the `.env.example` file and create your actual `.env` file:
```bash
cd backend
cp .env.example .env
```

### 2. Generate Secure JWT Secret
Generate a secure JWT secret key (minimum 256 bits):
```bash
# Using OpenSSL
openssl rand -base64 64

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### 3. Configure Database Password
- Use a strong, unique password for your database
- Avoid using default passwords like 'password' or 'admin'
- Consider using a password manager to generate secure passwords

### 4. Setup Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Replace the placeholder in your `.env` file

### 5. Email Configuration (if needed)
- Use app-specific passwords for Gmail
- Enable 2FA on your email account
- Consider using dedicated service accounts for application emails

## 🔒 Security Best Practices

### Environment Variables
- ✅ **DO**: Use environment variables for all secrets
- ✅ **DO**: Keep `.env` files out of version control
- ✅ **DO**: Use different secrets for different environments
- ❌ **DON'T**: Hardcode secrets in source code
- ❌ **DON'T**: Commit `.env` files to git
- ❌ **DON'T**: Share secrets in plain text

### Production Deployment
- Use secret management services (AWS Secrets Manager, Azure Key Vault, etc.)
- Rotate secrets regularly
- Use different secrets for different environments
- Implement proper logging without exposing secrets
- Use HTTPS/TLS for all communications

### Development Environment
- Never use production secrets in development
- Use `.env.example` as a template
- Share only non-sensitive configuration values
- Use mock services when possible for development

## 📝 File Structure After Security Setup
```
backend/
├── .env.example          # Template with placeholders (committed)
├── .env                  # Actual secrets (NOT committed)
├── .gitignore           # Includes .env in ignore list
└── src/main/resources/
    ├── application.properties           # Uses ${ENV_VAR:default}
    └── application-docker.properties    # Uses ${ENV_VAR:default}
```

## 🚨 Emergency Response

If secrets are accidentally committed:
1. **Immediately** rotate all exposed secrets
2. Remove secrets from git history using `git filter-branch` or BFG Repo-Cleaner
3. Update all environments with new secrets
4. Review access logs for potential unauthorized access
5. Consider revoking and regenerating API keys

## ✅ Security Checklist

- [ ] Replaced all placeholder secrets with actual secure values
- [ ] Generated strong JWT secret (256+ bits)
- [ ] Configured secure database password
- [ ] Set up Gemini API key
- [ ] Verified `.env` is in `.gitignore`
- [ ] Tested application with new configuration
- [ ] Documented secret rotation schedule
- [ ] Set up monitoring for unauthorized access attempts

## 📞 Support

If you need help with security configuration, please:
1. Check this guide first
2. Review the `.env.example` file
3. Consult the application logs for configuration issues
4. Contact the development team for assistance

---
**Remember: Security is everyone's responsibility. Keep your secrets safe!** 🔐