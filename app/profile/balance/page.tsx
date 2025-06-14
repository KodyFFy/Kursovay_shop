
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Wallet, 
  CreditCard, 
  Bitcoin,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  History
} from 'lucide-react'

interface BalanceTransaction {
  id: string
  amount: number
  type: string
  description: string
  createdAt: string
}

export default function BalancePage() {
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<BalanceTransaction[]>([])
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }

      const [balanceResponse, transactionsResponse] = await Promise.all([
        fetch('/api/balance', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/balance/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json()
        setBalance(balanceData.balance)
      }

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData.transactions)
      }
    } catch (error) {
      console.error('Fetch data error:', error)
      setError('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const handleTopUp = async () => {
    try {
      setProcessing(true)
      setError('')
      setSuccess('')
      
      const amountNum = parseFloat(amount)
      if (!amountNum || amountNum <= 0) {
        setError('Введите корректную сумму')
        return
      }

      const token = localStorage.getItem('token')

      const response = await fetch('/api/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          amount: amountNum, 
          paymentMethod 
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Баланс успешно пополнен на ${amountNum.toLocaleString('ru-RU')} ₽`)
        setBalance(data.balance)
        setAmount('')
        await fetchData() // Обновляем транзакции
      } else {
        setError(data.error || 'Ошибка пополнения баланса')
      }
    } catch (error) {
      console.error('Top up error:', error)
      setError('Ошибка подключения к серверу')
    } finally {
      setProcessing(false)
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'text-green-400'
      case 'PURCHASE':
        return 'text-red-400'
      case 'REFUND':
        return 'text-blue-400'
      default:
        return 'text-[var(--text-secondary)]'
    }
  }

  const getTransactionSign = (type: string) => {
    return type === 'DEPOSIT' || type === 'REFUND' ? '+' : '-'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--accent-primary)] mx-auto mb-4 animate-spin" />
          <p className="text-[var(--text-secondary)]">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/profile"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад к профилю
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text flex items-center gap-3">
            <Wallet className="w-10 h-10" />
            Баланс аккаунта
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Текущий баланс: <span className="text-[var(--accent-primary)] font-bold">
              {balance.toLocaleString('ru-RU')} ₽
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Up Form */}
          <div className="space-y-6">
            <div className="card-dark rounded-xl p-6 animate-fadeInUp">
              <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
                Пополнить баланс
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                    Сумма пополнения
                  </label>
                  <input
                    type="number"
                    placeholder="Введите сумму"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-dark w-full px-4 py-3 rounded-lg"
                    min="1"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-[var(--text-primary)]">
                    Способ оплаты
                  </label>
                  
                  <div className="space-y-3">
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                          : 'border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-[var(--accent-primary)]" />
                        <div className="flex-1">
                          <div className="font-semibold text-[var(--text-primary)]">
                            Банковская карта
                          </div>
                          <div className="text-sm text-[var(--text-secondary)]">
                            Visa, MasterCard, МИР
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          paymentMethod === 'card'
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]'
                            : 'border-[var(--border-primary)]'
                        }`} />
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'bitcoin'
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                          : 'border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50'
                      }`}
                      onClick={() => setPaymentMethod('bitcoin')}
                    >
                      <div className="flex items-center gap-3">
                        <Bitcoin className="w-6 h-6 text-[var(--accent-primary)]" />
                        <div className="flex-1">
                          <div className="font-semibold text-[var(--text-primary)]">
                            Bitcoin
                          </div>
                          <div className="text-sm text-[var(--text-secondary)]">
                            Криптовалютная оплата
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          paymentMethod === 'bitcoin'
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]'
                            : 'border-[var(--border-primary)]'
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleTopUp}
                disabled={processing || !amount}
                className="btn-primary w-full py-4 rounded-lg font-semibold text-lg disabled:opacity-50"
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Обработка...
                  </div>
                ) : (
                  `Пополнить на ${amount ? parseFloat(amount).toLocaleString('ru-RU') : '0'} ₽`
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                </div>
              )}

              {success && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    {success}
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-blue-400 text-sm text-center">
                  Для демонстрации пополнение происходит мгновенно. В реальном приложении здесь была бы интеграция с платежными системами.
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="space-y-6">
            <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-6">
                <History className="w-6 h-6 text-[var(--accent-primary)]" />
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  История операций
                </h3>
              </div>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                  <p className="text-[var(--text-secondary)]">
                    История операций пуста
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-[var(--text-primary)] text-sm">
                          {transaction.description}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                          {new Date(transaction.createdAt).toLocaleString('ru-RU')}
                        </div>
                      </div>
                      <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
                        {getTransactionSign(transaction.type)}{Math.abs(transaction.amount).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
