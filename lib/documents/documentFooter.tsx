import { CompanyDocumentInfo } from "@/types/document";

type Props = {
  company: CompanyDocumentInfo;
  showSignature?: boolean;
  showStamp?: boolean;
  showFooter?: boolean;
};

export default function DocumentFooter({
  company,
  showSignature = true,
  showStamp = true,
  showFooter = true,
}: Props) {

  return (

    <footer className="mt-16 border-t pt-8">

      <div className="flex items-end justify-between">

        <div>

          {showStamp &&
            company.company_stamp_url && (

            <img
              src={company.company_stamp_url}
              alt="Company Stamp"
              className="h-24 object-contain"
            />

          )}

        </div>

        <div className="text-center">

          {showSignature &&
            company.signature_url && (

            <img
              src={company.signature_url}
              alt="Signature"
              className="mx-auto h-16 object-contain"
            />

          )}

          <div className="mt-2 border-t border-gray-400 pt-2">

            <p className="font-semibold">
              Authorized Signatory
            </p>

          </div>

        </div>

      </div>

      {showFooter && (

        <div className="mt-8 border-t pt-4 text-center text-sm text-gray-600">

          {company.invoice_footer && (

            <p className="mb-2">

              {company.invoice_footer}

            </p>

          )}

          {company.footer_text && (

            <p>

              {company.footer_text}

            </p>

          )}

        </div>

      )}

    </footer>

  );

}
