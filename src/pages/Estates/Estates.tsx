import { Fragment } from "react";
import { PropertyCard } from "@/entities";
import { Section } from "@/features";
import { HeroEstates } from "@/widgets";
import { useAppSelector } from "@/shared/hooks/hooks";
import { Filter } from "@/features/Filter";
import styles from "./Estates.module.scss";
import { useGetEstates } from "@/shared/api/hooks";
import { Button } from "@/shared/ui";
import { useSearchParams } from "react-router-dom";

export const Estates = () => {
  //FIX_ME was is das?
  const isOpen = useAppSelector((state) => state.citySlice.isOpen);

  const [searchParams] = useSearchParams();

  const { data, status, fetchNextPage, isFetching, hasNextPage } =
    useGetEstates(9, searchParams);

  return (
    <>
      {isOpen ? (
        <HeroEstates />
      ) : (
        <Section title="All real estates" container>
          <Filter />
        </Section>
      )}
      <Section container>
        <div className={styles.estates}>
          {status === "success" &&
            data?.pages.map((page) => (
              <Fragment key={page.next}>
                {page.estates.map((item) => (
                  <PropertyCard
                    key={item.id}
                    id={item.id}
                    images={item.images}
                    price_usd={item.price_usd}
                    city={item.city}
                    project={item.project}
                  />
                ))}
              </Fragment>
            ))}
        </div>

        {hasNextPage && (
          <div className={styles.viewMore}>
            <Button
              type="primary"
              disabled={isFetching}
              onClick={() => fetchNextPage()}
            >
              View more
            </Button>
          </div>
        )}
      </Section>
    </>
  );
};
