-- Keep GrowMeal question rows aligned with the five competition categories.
alter table public.question_bank
  add column if not exists class_level text,
  add column if not exists garden_domain text;

alter table public.question_bank drop constraint if exists question_bank_growmeal_category_class_check;
alter table public.question_bank add constraint question_bank_growmeal_category_class_check check (
  quest_family <> 'GrowMeal' or
  (competition_category='GM-NUR' and class_level in ('Nursery 1','Nursery 2','Nursery 3')) or
  (competition_category='GM-LP' and class_level in ('Primary 1','Primary 2','Primary 3')) or
  (competition_category='GM-UP' and class_level in ('Primary 4','Primary 5','Primary 6')) or
  (competition_category='GM-JSS' and class_level in ('JSS 1','JSS 2','JSS 3')) or
  (competition_category='GM-SSS' and class_level in ('SSS 1','SSS 2','SSS 3'))
);

alter table public.question_bank drop constraint if exists question_bank_growmeal_garden_check;
alter table public.question_bank add constraint question_bank_growmeal_garden_check check (
  quest_family <> 'GrowMeal' or
  (competition_category='GM-NUR' and garden_code in ('N01','N02','N03','N04','N05','N06','N07','N08','N09','N10')) or
  (competition_category='GM-LP' and garden_code in ('P11','P12','P13','P14','P15','P16','P17','P18','P19','P20')) or
  (competition_category='GM-UP' and garden_code in ('P21','P22','P23','P24','P25','P26','P27','P28','P29','P30')) or
  (competition_category='GM-JSS' and garden_code in ('J31','J32','J33','J34','J35','J36','J37','J38','J39','J40')) or
  (competition_category='GM-SSS' and garden_code in ('S41','S42','S43','S44','S45','S46','S47','S48','S49','S50'))
);

create index if not exists question_bank_growmeal_class_idx
  on public.question_bank(competition_category,class_level,garden_code,lifecycle_status);
