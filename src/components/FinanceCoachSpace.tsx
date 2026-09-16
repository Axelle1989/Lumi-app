import React, { useState } from 'react';
import { 
  Coins, 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { ExpenseItem, SavingsChallenge } from '../types';
import { playGentleChime } from '../utils/soundAndBreathing';

interface FinanceCoachSpaceProps {
  username?: string;
}

export const FinanceCoachSpace: React.FC<FinanceCoachSpaceProps> = ({ username }) => {
  const [currency, setCurrency] = useState<'FCFA' | 'EUR' | 'USD'>('FCFA');

  // Budget numbers
  const [monthlyIncome, setMonthlyIncome] = useState<number>(() => {
    const saved = localStorage.getItem('lumi_finance_income');
    return saved ? Number(saved) : 150000; // 150 000 FCFA
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('lumi_finance_expenses');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'exp-1', title: 'Forfait internet & data cours', amount: 15000, category: 'etudes', date: '05/09/2026' },
      { id: 'exp-2', title: 'Courses alimentaires & marché', amount: 35000, category: 'nourriture', date: '08/09/2026' },
      { id: 'exp-3', title: 'Transport en commun & zémidjan', amount: 12000, category: 'transport', date: '11/09/2026' },
      { id: 'exp-4', title: 'Livres et polycopiés de révision', amount: 8000, category: 'etudes', date: '12/09/2026' },
    ];
  });

  // Purchase goal
  const [targetGoal, setTargetGoal] = useState({
    title: 'Ordinateur portable pour mes études',
    totalNeeded: 300000,
    currentSaved: 95000,
  });

  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState<ExpenseItem['category']>('nourriture');

  // Calculations
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = monthlyIncome - totalExpenses;
  const savingsRate = monthlyIncome > 0 ? Math.round(((monthlyIncome - totalExpenses) / monthlyIncome) * 100) : 0;
  const goalProgressPercent = Math.min(100, Math.round((targetGoal.currentSaved / targetGoal.totalNeeded) * 100));

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExpenseAmount);
    if (!newExpenseTitle.trim() || isNaN(amt) || amt <= 0) return;

    const newItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: newExpenseTitle.trim(),
      amount: amt,
      category: newExpenseCategory,
      date: new Date().toLocaleDateString('fr-FR'),
    };

    const updated = [newItem, ...expenses];
    setExpenses(updated);
    localStorage.setItem('lumi_finance_expenses', JSON.stringify(updated));
    setNewExpenseTitle('');
    setNewExpenseAmount('');
    playGentleChime(493);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    localStorage.setItem('lumi_finance_expenses', JSON.stringify(updated));
  };

  const handleUpdateIncome = (val: number) => {
    setMonthlyIncome(val);
    localStorage.setItem('lumi_finance_income', String(val));
  };

  const handleAddSavingsToGoal = (amount: number) => {
    const updatedGoal = {
      ...targetGoal,
      currentSaved: Math.min(targetGoal.totalNeeded, targetGoal.currentSaved + amount),
    };
    setTargetGoal(updatedGoal);
    playGentleChime(659);
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Coins className="w-4 h-4" />
              <span>Coach Finances & Épargne Jeunes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Bâtir sa liberté financière avec méthode et douceur.
            </h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Pour les étudiants et jeunes actifs : gère ton budget mensuel, élimine les dépenses inutiles et avance sûrement vers tes projets d’achat sans stress.
            </p>
          </div>

          {/* Currency switch */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            {(['FCFA', 'EUR', 'USD'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currency === curr
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-emerald-100 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Income Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-semibold">Revenu / Allocation estimé</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => handleUpdateIncome(Math.max(0, Number(e.target.value)))}
              className="text-2xl font-bold text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:border-emerald-500 outline-none w-36"
            />
            <span className="text-xs font-bold text-slate-600">{currency}</span>
          </div>
          <p className="text-[11px] text-slate-600">Bourses, allocations, jobs d'appoint, aide familiale</p>
        </div>

        {/* Expenses Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-semibold">Dépenses totales du mois</span>
            <ArrowDownRight className="w-4 h-4 text-rose-700" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-800">{totalExpenses.toLocaleString('fr-FR')}</span>
            <span className="text-xs font-bold text-slate-600">{currency}</span>
          </div>
          <p className="text-[11px] text-slate-600">{expenses.length} dépenses enregistrées ce mois-ci</p>
        </div>

        {/* Remaining / Savings */}
        <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-800">
            <span className="font-bold">Capacité d'épargne restante</span>
            <PiggyBank className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-emerald-900' : 'text-rose-600'}`}>
              {remainingBudget.toLocaleString('fr-FR')}
            </span>
            <span className="text-xs font-bold text-emerald-800">{currency}</span>
          </div>
          <p className="text-[11px] text-emerald-800/80 font-medium">
            Taux d'épargne potentiel : {savingsRate}% de tes revenus
          </p>
        </div>
      </div>

      {/* Main Grid: Add & List Expenses + Purchase Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Expenses log & input */}
        <div className="lg:col-span-7 space-y-4">
          {/* Add expense form */}
          <form onSubmit={handleAddExpense} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">Enregistrer une dépense</h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Intitulé (ex: Repas campus, Transport)"
                  value={newExpenseTitle}
                  onChange={(e) => setNewExpenseTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="number"
                  placeholder={`Montant (${currency})`}
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <select
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="nourriture">Nourriture</option>
                  <option value="etudes">Études & Livres</option>
                  <option value="transport">Transport</option>
                  <option value="logement">Logement & Charges</option>
                  <option value="loisirs">Loisirs & Sorties</option>
                  <option value="imprevus">Imprévus</option>
                </select>
              </div>
              <div className="sm:col-span-1">
                <button
                  type="submit"
                  className="w-full h-full p-2 rounded-xl bg-emerald-800 text-white flex items-center justify-center hover:bg-emerald-900 transition-colors shadow-2xs"
                  title="Ajouter"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Expenses list */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Dernières dépenses</h3>
              <span className="text-xs text-slate-600">{expenses.length} entrées</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {expenses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-200/80 text-[10px] font-semibold text-slate-700 uppercase">
                      {item.category}
                    </span>
                    <div>
                      <span className="font-bold text-slate-800 block">{item.title}</span>
                      <span className="text-[10px] text-slate-600">{item.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800">
                      -{item.amount.toLocaleString('fr-FR')} {currency}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(item.id)}
                      className="text-slate-600 hover:text-rose-600 transition-colors p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Purchase Goal & Savings Challenge */}
        <div className="lg:col-span-5 space-y-4">
          {/* Purchase Goal Card */}
          <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Objectif d'Achat Concret</span>
              </div>
              <span className="text-xs font-bold text-emerald-800 px-2.5 py-1 rounded-full bg-emerald-100">
                {goalProgressPercent}%
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{targetGoal.title}</h4>
              <div className="flex items-baseline justify-between text-xs text-slate-600 mb-2">
                <span>Épargné : <strong className="text-emerald-800 font-bold">{targetGoal.currentSaved.toLocaleString('fr-FR')} {currency}</strong></span>
                <span>Cible : <strong className="text-slate-800 font-bold">{targetGoal.totalNeeded.toLocaleString('fr-FR')} {currency}</strong></span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                  style={{ width: `${goalProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick add savings buttons */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Ajouter une épargne réalisée aujourd'hui :
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAddSavingsToGoal(currency === 'FCFA' ? 1000 : 5)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  +{currency === 'FCFA' ? '1 000' : '5'} {currency}
                </button>
                <button
                  onClick={() => handleAddSavingsToGoal(currency === 'FCFA' ? 5000 : 10)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  +{currency === 'FCFA' ? '5 000' : '10'} {currency}
                </button>
                <button
                  onClick={() => handleAddSavingsToGoal(currency === 'FCFA' ? 10000 : 25)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors shadow-2xs"
                >
                  +{currency === 'FCFA' ? '10 000' : '25'} {currency}
                </button>
              </div>
            </div>
          </div>

          {/* 3 Golden Youth Finance Rules */}
          <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>3 Règles d'Or de Lumi pour les Jeunes</span>
            </div>
            <ul className="space-y-2 text-xs text-amber-950 font-medium">
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-700">1.</span>
                <span><strong>La règle des 48h :</strong> Devant tout achat impulsif non essentiel, attends deux jours. Dans 80% des cas, l'envie s'évapore d'elle-même.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-700">2.</span>
                <span><strong>L'épargne automatique invisible :</strong> Mets de côté dès la réception de ton argent, jamais ce qu'il reste à la fin du mois.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-700">3.</span>
                <span><strong>Un petit montant régulier :</strong> Même 500 FCFA par jour font 15 000 FCFA par mois et 180 000 FCFA sur un an !</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
