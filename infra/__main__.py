import pulumi
import pulumi_cloudflare as cloudflare

config = pulumi.Config()
account_id = config.require("accountId")
zone_name = "emanuelelicia.it"

zone = cloudflare.Zone(
    "wedding",
    account={"id": account_id},
    name=zone_name,
    type="full",
)

# SSL: free Universal SSL cert is auto-issued once the zone is active;
# Workers custom domains auto-create DNS + issue certificates.
# Requires workers to exist: run `just website deploy` and
# `just backend deploy` before `pulumi up`.

cloudflare.WorkersCustomDomain(
    "website",
    account_id=account_id,
    zone_id=zone.id,
    hostname=zone_name,
    service="wedding-website",
)

cloudflare.WorkersCustomDomain(
    "api",
    account_id=account_id,
    zone_id=zone.id,
    hostname=f"api.{zone_name}",
    service="wedding-backend",
)

pulumi.export("nameservers", zone.name_servers)
