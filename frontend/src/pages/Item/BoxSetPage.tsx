import type { AppConfig } from '@/hooks/api/useConfig';
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models';
import BaseMediaPage from './BaseMediaPage';
import DetailBadges from './DetailBadges';
import { Skeleton } from '@/components/ui/skeleton';
import { getPrimaryImageUrl } from '@/utils/jellyfinUrls';
import { useState } from 'react';
import { useBoxSetItems } from '@/hooks/api/useBoxSetItems';
import SectionScroller from '@/components/SectionScroller';
import { useTranslation } from 'react-i18next';
import ScrollableSectionPoster from '@/components/ScrollableSectionPoster';
import ItemAdminButton from '@/components/ItemAdminButton';
import FavoriteButton from '../../components/FavoriteButton';
import { ImageOff } from 'lucide-react';

interface BoxSetPageProps {
    item: BaseItemDto;
    config: AppConfig;
}

const BoxSetPage = ({ item, config }: BoxSetPageProps) => {
    const { t } = useTranslation('item');
    const [primaryImageError, setPrimaryImageError] = useState(false);
    const [isPosterLoaded, setIsPosterLoaded] = useState(false);
    const { data: boxSetItems } = useBoxSetItems(item.Id || '');

    return (
        <BaseMediaPage
            itemId={item.Id || ''}
            name={item.Name || ''}
            showLogo={false}
            topPadding={false}
        >
            <div className="pt-24 sm:pt-32 pb-12 px-4 sm:px-12 max-w-7xl mx-auto w-full flex flex-col gap-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative z-10 w-full">
                    {/* Left Column (Poster) */}
                    <div className="w-48 sm:w-64 md:w-72 lg:w-80 shrink-0 mx-auto lg:mx-0">
                        <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-2xl shadow-black/85 border border-white/10 bg-muted flex items-center justify-center">
                            {!primaryImageError && item.Id ? (
                                <>
                                    <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
                                    <img
                                        src={getPrimaryImageUrl(
                                            item.Id || '',
                                            undefined,
                                            item.ImageTags?.Primary
                                        )}
                                        alt={item.Name + ' Primary'}
                                        className={[
                                            'object-cover rounded-xl w-full h-full relative z-10',
                                            'transition-[filter,opacity] duration-700 ease-out',
                                            isPosterLoaded ? 'blur-0 opacity-100' : 'blur-md opacity-0',
                                        ].join(' ')}
                                        onLoad={() => setIsPosterLoaded(true)}
                                        onError={() => setPrimaryImageError(true)}
                                    />
                                </>
                            ) : (
                                <ImageOff className="text-muted-foreground w-12 h-12" />
                            )}
                        </div>
                    </div>

                    {/* Right Column (Details) */}
                    <div className="flex-1 flex flex-col gap-5 w-full text-left">
                        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            {t('collection')}
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2 text-wrap balance">
                            {item.Name}
                        </h1>

                        {/* Badges */}
                        <DetailBadges item={item} appConfig={config} />

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2.5 items-center mt-2">
                            <FavoriteButton
                                item={item}
                                showFavoriteButton={
                                    item.Type && config.itemPage?.favoriteButton?.includes(item.Type)
                                }
                            />
                            <ItemAdminButton item={item} />
                        </div>

                        {/* Overview */}
                        {item.Overview && (
                            <p className="text-base sm:text-lg text-foreground/90 leading-relaxed font-normal max-w-3xl mt-2">
                                {item.Overview}
                            </p>
                        )}
                    </div>
                </div>

                {/* Collection Items */}
                <div className="w-full mt-6 relative z-10">
                    <SectionScroller
                        title={<h3 className="text-2xl font-bold">{t('boxSetItems')}</h3>}
                        items={
                            boxSetItems?.map((boxSetItem) => {
                                return (
                                    <ScrollableSectionPoster key={boxSetItem.Id} item={boxSetItem}>
                                        {boxSetItem.PremiereDate && (
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {new Date(boxSetItem.PremiereDate).getFullYear()}
                                            </span>
                                        )}
                                    </ScrollableSectionPoster>
                                );
                            }) ||
                            Array.from({ length: 5 }, (_, i) => (
                                <div
                                    key={i}
                                    className="w-36 h-54 lg:w-44 lg:h-64 2xl:w-52 2xl:h-80 shrink-0"
                                >
                                    <Skeleton className="w-full h-full rounded-md" />
                                </div>
                            ))
                        }
                    />
                </div>
            </div>
        </BaseMediaPage>
    );
};

export default BoxSetPage;
