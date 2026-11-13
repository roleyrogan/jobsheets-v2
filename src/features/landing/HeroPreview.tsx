import { useCallback, useMemo, useState } from 'react'

import { HeroBoard } from '@/features/landing/HeroBoard'
import { HeroOverview } from '@/features/landing/HeroOverview'
import {
  HeroPreviewChrome,
  ViewPane,
  type HeroTab,
} from '@/features/landing/HeroPreviewChrome'
import { HeroSheet } from '@/features/landing/HeroSheet'
import {
  cloneSampleRows,
  type SampleRow,
} from '@/features/landing/sampleData'
import { nextStatus, sortRows, type SortKey } from '@/features/landing/heroSort'
import { useHeroDemo } from '@/features/landing/useHeroDemo'

export function HeroPreview() {
  const [tab, setTab] = useState<HeroTab>('Sheet')
  const [rows, setRows] = useState<SampleRow[]>(() => cloneSampleRows())
  const [sortKey, setSortKey] = useState<SortKey>('added')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [flashId, setFlashId] = useState<string | null>(null)
  const [flashTone, setFlashTone] = useState<'a' | 'b'>('a')
  const [hiddenTab, setHiddenTab] = useState<HeroTab | null>(null)

  const setSort = useCallback((key: SortKey, dir: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDir(dir)
  }, [])

  const flashRow = useCallback((id: string) => {
    setFlashTone((tone) => (tone === 'a' ? 'b' : 'a'))
    setFlashId(id)
    window.setTimeout(
      () => setFlashId((current) => (current === id ? null : current)),
      1000,
    )
  }, [])

  const setStatus = useCallback((id: string, status: SampleRow['status']) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, status } : row)),
    )
  }, [])

  const { cancel, replay } = useHeroDemo({
    setSort,
    setRows,
    flashRow,
    setStatus,
  })

  const order = useMemo(
    () => sortRows(rows, sortKey, sortDir).map((row) => row.id),
    [rows, sortKey, sortDir],
  )

  function selectTab(next: HeroTab) {
    cancel()
    if (next === tab) return
    setHiddenTab(tab)
    setTab(next)
    window.setTimeout(() => setHiddenTab(null), 220)
  }

  function onSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'added' ? 'desc' : 'asc')
    }
  }

  function onCycleStatus(id: string) {
    const row = rows.find((item) => item.id === id)
    if (!row) return
    setStatus(id, nextStatus(row.status))
    flashRow(id)
  }

  return (
    <HeroPreviewChrome
      tab={tab}
      onSelectTab={selectTab}
      onReplay={() => {
        setTab('Sheet')
        replay()
      }}
    >
      <ViewPane show={tab === 'Sheet'} hiding={hiddenTab === 'Sheet'}>
        <HeroSheet
          rows={rows}
          order={order}
          sortKey={sortKey}
          sortDir={sortDir}
          flashId={flashId}
          flashTone={flashTone}
          onSort={onSort}
          onCycleStatus={onCycleStatus}
          onInteract={cancel}
        />
      </ViewPane>
      <ViewPane show={tab === 'Board'} hiding={hiddenTab === 'Board'}>
        <HeroBoard rows={rows} />
      </ViewPane>
      <ViewPane show={tab === 'Overview'} hiding={hiddenTab === 'Overview'}>
        <HeroOverview rows={rows} active={tab === 'Overview'} />
      </ViewPane>
    </HeroPreviewChrome>
  )
}
