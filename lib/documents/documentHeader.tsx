import { CompanyDocumentInfo } from "@/types/document";

type Props = {
  company: CompanyDocumentInfo;
};

export default function DocumentHeader({
  company,
}: Props) {
  return (
    <header className="mb-8 flex items-start justify-between border-b pb-6">

      <div className="flex items-center gap-4">

        {company.logo_url ? (
          <img
            src={company.logo_url}
            alt={company.company_name}
            className="h-20 w-20 object-contain"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-xl border text-3xl font-bold">
            {company.company_name.charAt(0)}
          </div>
        )}

        <div>

          <h1 className="text-2xl font-bold">
            {company.company_name}
          </h1>

          {company.trading_name && (
            <p className="text-gray-600">
              {company.trading_name}
            </p>
          )}

          {company.physical_address && (
            <p className="text-sm text-gray-600">
              {company.physical_address}
            </p>
          )}

          <p className="text-sm text-gray-600">

            {[company.city, company.country]
              .filter(Boolean)
              .join(", ")}

          </p>

        </div>

      </div>

      <div className="space-y-1 text-right text-sm">

        {company.phone && (
          <p>{company.phone}</p>
        )}

        {company.email && (
          <p>{company.email}</p>
        )}

        {company.website && (
          <p>{company.website}</p>
        )}

      </div>

    </header>
  );
}
