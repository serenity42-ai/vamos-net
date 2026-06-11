/**
 * Minimal type shim for @tryghost/admin-api — the package ships without
 * declarations. We only use a tiny slice of the surface (members.add).
 */
declare module "@tryghost/admin-api" {
  interface GhostAdminAPIOptions {
    url: string;
    key: string;
    version: string;
    makeRequest?: unknown;
  }

  interface MemberCreatePayload {
    email: string;
    name?: string;
    note?: string;
    labels?: string[] | { name: string; slug?: string }[];
    newsletters?: { id: string }[];
    subscribed?: boolean;
  }

  interface Member {
    id: string;
    email: string;
    name?: string | null;
    note?: string | null;
    labels?: unknown[];
    newsletters?: { id: string }[];
    subscribed?: boolean;
    created_at?: string;
  }

  interface MembersAPI {
    add(payload: MemberCreatePayload): Promise<Member>;
    read(query: { id?: string; email?: string }): Promise<Member>;
  }

  class GhostAdminAPI {
    constructor(options: GhostAdminAPIOptions);
    members: MembersAPI;
  }

  export default GhostAdminAPI;
}
