import Image from "next/image";
const root="/storyverse/images/";
const files:Record<string,string>={
 "home-hero":"sv-home-hero.webp","home-school":"sv-home-school.webp","home-community":"sv-home-community.webp",
 "school-progress":"sv-school-progress.webp","school-review":"sv-school-review.webp",
 "reader-hero":"sv-reader-hero.webp","reader-continue":"sv-reader-continue.webp","reader-milestones":"sv-reader-milestones.webp",
 "family-hero":"sv-family-hero.webp","family-monitoring":"sv-family-monitoring.webp","family-plan":"sv-family-plan.webp","family-achievement":"sv-family-achievement.webp",
 "community-hero":"sv-community-hero.webp","community-groups":"sv-community-groups.webp","community-adults":"sv-community-adults.webp.png",
 "library-hero":"sv-library-hero.webp","library-worlds":"sv-library-worlds.webp","library-levels":"sv-library-levels.webp",
 "story-reader-hero":"sv-story-reader-hero.webp","story-audio":"sv-story-audio.webp","story-reflection":"sv-story-reflection.webp",
 "rewards-hero":"sv-rewards-hero.webp","rewards-milestone":"sv-rewards-milestone.webp",
 "creator-hero":"sv-creator-hero.webp.png","creator-manuscript":"sv-creator-manuscript.webp.png","creator-illustration":"sv-creator-illustration.webp.png",
 "admin-hero":"sv-admin-hero.webp.png","admin-review":"sv-admin-review.webp.png",
 "level-little-explorers":"sv-level-little-explorers.webp.png","level-story-adventurers":"sv-level-story-adventurers.webp.png","level-master-storytellers":"sv-level-master-storytellers.webp.png"
};
export function StoryVerseAsset({name,alt,hero=false}:{name:string;alt:string;hero?:boolean}){
 const file=files[name];if(!file)return null;
 return <div style={{position:"relative",width:"100%",height:hero?"clamp(180px,28vw,340px)":"190px",overflow:"hidden",borderRadius:16,marginBottom:16}}>
  <Image src={root+file} alt={alt} fill sizes={hero?"(max-width: 768px) 100vw, 1160px":"(max-width: 768px) 100vw, 400px"} style={{objectFit:"cover"}} priority={name==="home-hero"}/>
 </div>;
}
export function StoryVerseVisuals({items}:{items:{name:string;title:string;alt:string}[]}){
 return <div className="sv-grid">{items.filter(item=>files[item.name]).map(item=><article className="sv-card" key={item.name}><StoryVerseAsset name={item.name} alt={item.alt}/><h3>{item.title}</h3></article>)}</div>;
}
