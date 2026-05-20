'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Clock, Star, ChevronDown, ChevronUp, Send, Loader2, AlertCircle } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Badge } from '@/components/ui/badge'
import { getAssignments, submitEvaluation, type ReviewerAssignmentsResponse } from '@/lib/reviewer/api'

const navItems = [
  { href: '/dashboard/reviewer', label: 'Dashboard' },
  { href: '/dashboard/reviewer/submissions', label: 'My Submissions' },
  { href: '/dashboard/reviewer/scoring', label: 'Scoring Guide' },
  { href: '/dashboard/reviewer/conflicts', label: 'Conflicts' },
  { href: '/dashboard/reviewer/help', label: 'Help' },
  { href: '/dashboard/reviewer/settings', label: 'Settings' },
]

const RECOMMENDATIONS = [
  { value: 'APPROVE', label: 'Approve', color: 'text-green-700 bg-green-50 border-green-200' },
  { value: 'NEEDS_IMPROVEMENT', label: 'Needs Improvement', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  { value: 'REJECT', label: 'Reject', color: 'text-red-700 bg-red-50 border-red-200' },
]

export default function SubmissionsPage() {
  const [tab, setTab] = useState<'pending' | 'completed'>('pending')
  const [assignments, setAssignments] = useState<ReviewerAssignmentsResponse['data']>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [evalForms, setEvalForms] = useState<Record<string, { score: string; comment: string; recommendation: string }>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [tab])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await getAssignments(tab)
      setAssignments(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  function getForm(id: string) {
    return evalForms[id] ?? { score: '', comment: '', recommendation: 'APPROVE' }
  }

  function setForm(id: string, patch: Partial<{ score: string; comment: string; recommendation: string }>) {
    setEvalForms(prev => ({ ...prev, [id]: { ...getForm(id), ...patch } }))
  }

  async function handleSubmit(applicationId: string, assignmentId: string) {
    const form = getForm(assignmentId)
    const score = parseFloat(form.score)
    if (isNaN(score) || score < 0 || score > 10) { setError('Score must be between 0 and 10'); return }
    if (!form.comment.trim()) { setError('Please provide feedback comments'); return }
    setSubmitting(assignmentId)
    setError('')
    try {
      await submitEvaluation({ applicationId, score, comment: form.comment, recommendation: form.recommendation })
      setSubmitSuccess(assignmentId)
      setTimeout(() => { setSubmitSuccess(null); load() }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit evaluation')
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <DashboardShell title="My Submissions" description="Manage your assigned applications and evaluations" navItems={navItems} portalLabel="REVIEWER PORTAL">
      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl border border-border bg-muted/50 p-1 w-fit">
        {(['pending', 'completed'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${tab === t ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {t}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={14} className="shrink-0" /> {error}
          <button onClick={() => setError('')} className="ml-auto text-xs underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i: number) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : assignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm font-medium text-foreground">No {tab} assignments</p>
          <p className="mt-1 text-xs text-muted-foreground">{tab === 'pending' ? 'You have no pending reviews right now.' : 'No completed evaluations yet.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => {
            const form = getForm(a.id)
            const isExpanded = expandedId === a.id
            const isSuccess = submitSuccess === a.id

            return (
              <div key={a.id} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{a.startupName}</p>
                    <p className="text-xs text-muted-foreground">{a.programName} · {new Date(a.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    {a.score !== undefined && (
                      <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                        <Star size={13} className="text-accent" fill="currentColor" />
                        {a.score}/10
                      </div>
                    )}
                    {a.recommendation && (
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${RECOMMENDATIONS.find(r => r.value === a.recommendation)?.color ?? 'border-border bg-muted text-muted-foreground'}`}>
                        {a.recommendation.replace('_', ' ')}
                      </span>
                    )}
                    {tab === 'pending' && (
                      <button onClick={() => setExpandedId(isExpanded ? null : a.id)}
                        className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted">
                        {isExpanded ? <><ChevronUp size={13} /> Close</> : <><ChevronDown size={13} /> Evaluate</>}
                      </button>
                    )}
                  </div>
                </div>

                {/* Evaluation form */}
                {tab === 'pending' && isExpanded && (
                  <div className="border-t border-border bg-muted/30 px-5 py-5">
                    {isSuccess ? (
                      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        <CheckCircle size={15} /> Evaluation submitted successfully!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="ink-label">Score (0–10) *</label>
                            <input type="number" min="0" max="10" step="0.1" value={form.score}
                              onChange={e => setForm(a.id, { score: e.target.value })}
                              className="ink-input" placeholder="e.g. 7.5" />
                          </div>
                          <div>
                            <label className="ink-label">Recommendation *</label>
                            <select value={form.recommendation} onChange={e => setForm(a.id, { recommendation: e.target.value })} className="ink-input">
                              {RECOMMENDATIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="ink-label">Feedback & Comments *</label>
                          <textarea value={form.comment} onChange={e => setForm(a.id, { comment: e.target.value })}
                            rows={4} className="ink-input h-auto py-2.5 resize-none"
                            placeholder="Provide detailed feedback on innovation, feasibility, market potential, and team strength…" />
                        </div>
                        <button onClick={() => handleSubmit(a.applicationId, a.id)} disabled={submitting === a.id}
                          className="flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60">
                          {submitting === a.id ? <><Loader2 size={14} className="animate-spin" />Submitting…</> : <><Send size={14} />Submit Evaluation</>}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
