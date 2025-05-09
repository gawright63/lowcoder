import axios from "axios";
import { NPM_REGISTRY_URL } from "constants/npmPlugins";
import { RemoteCompSource, RemoteCompInfo, NpmVersionMeta, NpmPackageMeta } from "types/remoteComp";

export function getRemoteCompType(
  source: "npm",
  packageName: string,
  version: string,
  compName: string
) {
  return `remote#${source}#${packageName}@${version}#${compName}`;
}

export function parseCompType(compType: string) {
  let [type, source, packageNameAndVersion, compName] = compType.split("#");
  const isRemote = type === "remote";

  if (!isRemote) {
    return {
      isRemote,
      compName: compType,
    };
  }

  const packageRegex = /^(?<packageName>(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*)@(?<packageVersion>([0-9]+.[0-9]+.[0-9]+)(-[\w\d-]+)?)$/;
  const matches = packageNameAndVersion.match(packageRegex);
  if (!matches?.groups) {
    throw new Error(`Invalid package name and version: ${packageNameAndVersion}`);
  }

  const {packageName, packageVersion} = matches.groups;
  return {
    compName,
    isRemote,
    packageName,
    packageVersion,
    source: source as RemoteCompSource,
  } as RemoteCompInfo;
}

export async function getNpmPackageMeta(packageName: string) {
  const axiosInstance = axios.create({
    baseURL: NPM_REGISTRY_URL,
    withCredentials: true,
  })
  const res = await axiosInstance.get<NpmPackageMeta>(
    `/none/${packageName}`,
  );
  if (res.status >= 400) {
    return null;
  }
  return res.data;
}

export async function getLatestVersion(remoteInfo: RemoteCompInfo): Promise<NpmVersionMeta | null> {
  if (!remoteInfo.isRemote || remoteInfo.source !== "npm") {
    return null;
  }

  const packageMeta = await getNpmPackageMeta(remoteInfo.packageName);
  if (!packageMeta) {
    return null;
  }

  const latestVersion = packageMeta["dist-tags"].latest;
  return packageMeta.versions?.[latestVersion] || null;
}

export function normalizeNpmPackage(nameOrUrl: string) {
  const prefixReg = /^https?:\/\/(www.)?npmjs.(org|com)\/package\//;
  if (prefixReg.test(nameOrUrl)) {
    return nameOrUrl.replace(prefixReg, "");
  }
  return nameOrUrl;
}

export function validateNpmPackage(packageNameOrUrl: string) {
  const name = normalizeNpmPackage(packageNameOrUrl);
  return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name);
}
