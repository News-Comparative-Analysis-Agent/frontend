import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchIssueAnalysis, fetchDailyIssues, fetchIssueTimeline } from '../api/issues'
import { fetchTopNewsByPublisher } from '../api/news'
import { IssueAnalysisResponse, PreGeneratedDraft, IssueTimelineResponse } from '../types/analysis'
import { mapToAnalysisViewModel } from '../utils/mappers/analysisMapper'
import { AnalysisViewModel } from '../types/models/analysis'

export const useAnalysisPageData = (issueId: string | null) => {
  const navigate = useNavigate()
  const [analysisData, setAnalysisData] = useState<IssueAnalysisResponse | null>(null)
  const [timelineData, setTimelineData] = useState<IssueTimelineResponse | null>(null)
  const [parsedDraft, setParsedDraft] = useState<PreGeneratedDraft | null>(null)
  const [sourceArticles, setSourceArticles] = useState<Record<string, any[]>>({})
  
  const [candidateImages, setCandidateImages] = useState<string[]>([])
  const [imageIndex, setImageIndex] = useState(0)
  const [issueImage, setIssueImage] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeMedia, setActiveMedia] = useState('all')

  useEffect(() => {
    if (!issueId) {
      setError('이슈 ID가 필요합니다.')
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        const [analysisRes, issuesRes, newsRes, timelineRes] = await Promise.all([
          fetchIssueAnalysis(issueId),
          fetchDailyIssues(),
          fetchTopNewsByPublisher(),
          fetchIssueTimeline(issueId)
        ])
        
        setAnalysisData(analysisRes)
        setSourceArticles(newsRes)
        setTimelineData(timelineRes)
        
        if (analysisRes.pre_generated_draft) {
          try {
            const draft = JSON.parse(analysisRes.pre_generated_draft) as PreGeneratedDraft
            setParsedDraft(draft)
          } catch (e) {
            console.error('Failed to parse draft JSON', e)
          }
        }
        
        const allIssues = [...(issuesRes.top_issues || []), ...(issuesRes.chart_out_issues || [])]
        const matchedIssue = allIssues.find(iss => 
          String(iss.id) === String(issueId) || 
          (analysisRes.name && iss.name.includes(analysisRes.name.substring(0, 10).trim()))
        )
        
        const allArticles = Object.values(newsRes).flat()
        const matchedArticle = allArticles.find(art => 
          (analysisRes.name && (art.title.includes(analysisRes.name.substring(0, 10).trim()) || analysisRes.name.includes(art.title.substring(0, 10).trim())))
        )
        
        const candidates = Array.from(new Set([
          ...(matchedIssue?.image_urls || []),
          matchedArticle?.image_url,
          ...(analysisRes as any).image_urls || [],
          (analysisRes as any).image_url
        ])).filter(Boolean) as string[]
                          
        setCandidateImages(candidates)
        setImageIndex(0)
        setIssueImage(candidates[0] || null)

      } catch (err) {
        console.error('Failed to fetch analysis data:', err)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [issueId])

  // 매퍼를 사용하여 ViewModel 생성
  const viewModel: AnalysisViewModel | null = useMemo(() => {
    if (!analysisData) return null;
    return mapToAnalysisViewModel(analysisData, parsedDraft, sourceArticles, timelineData);
  }, [analysisData, parsedDraft, sourceArticles, timelineData]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth < 500 && imageIndex < candidateImages.length - 1) {
      const nextIndex = imageIndex + 1;
      setImageIndex(nextIndex);
      setIssueImage(candidateImages[nextIndex]);
    }
  }

  return {
    viewModel,
    issueImage,
    handleImageLoad,
    loading,
    error,
    activeMedia,
    setActiveMedia,
    navigate
  }
}
