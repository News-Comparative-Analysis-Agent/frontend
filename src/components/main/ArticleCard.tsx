import { useNavigate } from 'react-router-dom';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  boardColor: string;
  boardTextColor: string;
  isFirst?: boolean;
}

export const ArticleCard = ({ article, boardColor, boardTextColor, isFirst }: ArticleCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      className={`${isFirst ? 'pb-6 pt-1 border-b border-slate-100' : 'py-2.5 flex gap-3 items-baseline'} group cursor-pointer`}
      onClick={() => navigate('/analysis')}
    >
      {isFirst ? (
        <>
          <div className="relative w-full aspect-video mb-3 overflow-hidden rounded-xl">
            <img 
              alt={`Ranking ${article.rank}`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              src={article.image}
            />
            <div className={`absolute top-2 left-2 size-7 ${boardColor} text-white flex items-center justify-center font-bold rank-number rounded shadow-md`}>
              {article.rank}
            </div>
          </div>
          <h5 className={`text-[15px] font-bold text-slate-900 leading-snug group-hover:${boardTextColor} transition-colors`}>
            {article.title}
          </h5>
        </>
      ) : (
        <>
          <span className="rank-number text-xs font-bold text-slate-400 w-4 text-center">{article.rank}</span>
          <p className={`text-[13px] font-medium text-slate-700 truncate flex-1 group-hover:${boardTextColor}`}>
            {article.title}
          </p>
        </>
      )}
    </div>
  );
};
