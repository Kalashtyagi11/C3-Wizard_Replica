using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace C3WizardHelper.ViewModels
{
    public class EncryptDecryptPasswordReset
    {
        //    private static readonly string EncryptionKey = "MAKV2SPBNI99212";
        //    private static readonly byte[] SaltBytes = new byte[]
        //    {
        //    0x49, 0x76, 0x61, 0x6e,
        //    0x20, 0x4d, 0x65, 0x64,
        //    0x76, 0x65, 0x64, 0x65,
        //    0x76
        //    };

        //    public string Encrypt(int userId)
        //    {
        //        byte[] clearBytes = Encoding.Unicode.GetBytes(userId.ToString());

        //        using (Aes encryptor = Aes.Create())
        //        {
        //            var pdb = new Rfc2898DeriveBytes(EncryptionKey, SaltBytes);
        //            encryptor.Key = pdb.GetBytes(32);
        //            encryptor.IV = pdb.GetBytes(16);

        //            using (var ms = new MemoryStream())
        //            using (var cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
        //            {
        //                cs.Write(clearBytes, 0, clearBytes.Length);
        //                cs.Close();
        //                return Convert.ToBase64String(ms.ToArray());
        //            }
        //        }
        //    }

        //    public int Decrypt(string cipherText)
        //    {
        //        byte[] cipherBytes = Convert.FromBase64String(cipherText);

        //        using (Aes encryptor = Aes.Create())
        //        {
        //            var pdb = new Rfc2898DeriveBytes(EncryptionKey, SaltBytes);
        //            encryptor.Key = pdb.GetBytes(32);
        //            encryptor.IV = pdb.GetBytes(16);

        //            using (var ms = new MemoryStream())
        //            using (var cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
        //            {
        //                cs.Write(cipherBytes, 0, cipherBytes.Length);
        //                cs.Close();
        //                string decrypted = Encoding.Unicode.GetString(ms.ToArray());
        //                return int.Parse(decrypted);
        //            }
        //        }
        //    }
        //}
        private static readonly string EncryptionKey = "MAKV2SPBNI99212"; // Must be 16/24/32 bytes for AES
        private static readonly byte[] IV = new byte[16]; // Use a fixed or random IV in real-world use

        public string Encrypt(string plainText)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(EncryptionKey.PadRight(32).Substring(0, 32));
            byte[] encrypted;

            using (Aes aes = Aes.Create())
            {
                aes.Key = keyBytes;
                aes.IV = IV;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;

                using MemoryStream ms = new();
                using CryptoStream cs = new(ms, aes.CreateEncryptor(), CryptoStreamMode.Write);
                using (StreamWriter sw = new(cs))
                {
                    sw.Write(plainText);
                }

                encrypted = ms.ToArray();
            }

            return Base64UrlEncode(encrypted);
        }

        public string Decrypt(string encryptedText)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(EncryptionKey.PadRight(32).Substring(0, 32));
            byte[] encryptedBytes = Base64UrlDecode(encryptedText);

            using (Aes aes = Aes.Create())
            {
                aes.Key = keyBytes;
                aes.IV = IV;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;

                using MemoryStream ms = new(encryptedBytes);
                using CryptoStream cs = new(ms, aes.CreateDecryptor(), CryptoStreamMode.Read);
                using StreamReader sr = new(cs);
                return sr.ReadToEnd();
            }
        }

        private static string Base64UrlEncode(byte[] input)
        {
            return Convert.ToBase64String(input)
                          .Replace("+", "-")
                          .Replace("/", "_")
                          .Replace("=", "");
        }

        private static byte[] Base64UrlDecode(string input)
        {
            string output = input.Replace("-", "+").Replace("_", "/");
            switch (output.Length % 4)
            {
                case 2: output += "=="; break;
                case 3: output += "="; break;
                case 1: output += "==="; break;
            }
            return Convert.FromBase64String(output);
        }
    }
}
