package org.lowcoder.domain.organization.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.lowcoder.domain.organization.model.MemberRole;
import org.lowcoder.domain.organization.model.OrgMember;
import org.lowcoder.infra.annotation.PossibleEmptyMono;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface OrgMemberService {

    Flux<OrgMember> getOrganizationMembers(String orgId);

    Flux<OrgMember> getOrganizationMembers(String orgId, int page, int count);

    Mono<OrgMember> getCurrentOrgMember(String userId);

    @PossibleEmptyMono
    Flux<OrgMember> getAllActiveOrgs(String userId);

    Mono<Long> getOrgMemberCount(String orgId);

    Mono<Boolean> doesAtleastOneAdminExist();

    Mono<Long> countAllActiveOrgs(String userId);

    Mono<OrgMember> getOrgMember(String orgId, String userId);

    Mono<Boolean> addMember(String orgId, String userId, MemberRole memberRole);

    Mono<Boolean> updateMemberRole(String orgId, String user, MemberRole memberRole);

    Mono<Boolean> removeMember(String orgId, String userId);

    Mono<Boolean> deleteOrgMembers(String orgId);

    Mono<Boolean> tryAddOrgMember(String orgId, String userId, MemberRole role);

    Mono<Map<String, OrgMember>> getOrgMemberRoles(Collection<String> orgIds, String userId);

    Mono<UserOrgMemberInfo> getUserOrgMemberInfo(String userId);

    Mono<Boolean> markAsUserCurrentOrgId(String orgId, String userId);

    Mono<Boolean> removeCurrentOrgMark(String previousCurrentOrgId, String userId);

    Mono<List<OrgMember>> getAllOrgAdmins(String orgId);

    Mono<Void> bulkAddMember(String orgId, Collection<String> userIds, MemberRole memberRole);

    Mono<Void> bulkAddToOrgs(Collection<String> orgIds, String userId, MemberRole memberRole);

    Mono<Void> addToAllOrgAsAdminIfNot(String userId);

    Mono<Boolean> bulkRemoveMember(String orgId, Collection<String> userIds);

    record UserOrgMemberInfo(OrgMember currentOrgMember, List<OrgMember> orgMembers) {
    }

}
