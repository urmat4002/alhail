import { ReactNode } from "react";
import { useGetStaticData } from "@/shared/api/hooks";
import { Section } from "@/features";
import { Typography } from "@/shared/ui";
import { capitalize } from "@/shared/helper/utils";
import { Сonfidentiality } from "../../shared/ui/Icons/Сonfidentiality";
import { WideSelection } from "../../shared/ui/Icons/WideSelection";
import { Feedback } from "../../shared/ui/Icons/Feedback";
import { ExclusiveOffers } from "../../shared/ui/Icons/ExclusiveOffers";
import style from "./Benefits.module.scss";

export const Benefits = () => {
  const { data } = useGetStaticData();

  return (
    <Section title={capitalize(data?.static_data.body.benefits)} container>
      <div className={style.benefits}>
        <BenefitsCard
          icon={<ExclusiveOffers />}
          title={data?.static_data.body.exclusive_offers}
          description={data?.static_data.body.exclusive_offers_description}
        />
        <BenefitsCard
          icon={<Сonfidentiality />}
          title={data?.static_data.body.confidentiality}
          description={data?.static_data.body.confidentiality_description}
        />
        <BenefitsCard
          icon={<WideSelection />}
          title={data?.static_data.body.wide_selection}
          description={data?.static_data.body.wide_selection_description}
        />
        <BenefitsCard
          icon={<Feedback />}
          title={data?.static_data.body.feedback}
          description={data?.static_data.body.feedback_description}
        />
      </div>
    </Section>
  );
};

const BenefitsCard = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string | undefined;
  description: string | undefined;
}) => (
  <div className={style.benefitsItem}>
    {icon}
    <Typography variant="h3" capitalize>
      {title}
    </Typography>
    <Typography variant="body" capitalize color="white">
      {description}
    </Typography>
  </div>
);
