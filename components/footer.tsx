
import Link from 'next/link'
import { Key, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] mt-16">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Key className="w-6 h-6 text-[var(--accent-primary)]" />
              <span className="gradient-text">KeyShop</span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Лицензионные ключи для игр и программ. Быстро, надежно, выгодно.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors cursor-pointer">
                <Phone className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-[var(--text-primary)] font-semibold">Категории</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=games" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm">
                  Игры
                </Link>
              </li>
              <li>
                <Link href="/products?category=software" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm">
                  Программное обеспечение
                </Link>
              </li>
              <li>
                <Link href="/products?category=antivirus" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm">
                  Антивирусы
                </Link>
              </li>
              <li>
                <Link href="/products?category=windows" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm">
                  Windows
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-[var(--text-primary)] font-semibold">Поддержка</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm">
                  Помощь
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-[var(--text-primary)] font-semibold">Контакты</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-[var(--text-secondary)]">support@keyshop.ru</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-[var(--text-secondary)]">+7 (800) 123-45-67</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-[var(--text-secondary)]">Москва, Россия</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border-primary)] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            © 2024 KeyShop. Все права защищены.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors text-sm">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors text-sm">
              Пользовательское соглашение
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
