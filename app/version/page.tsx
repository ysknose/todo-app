import packageJson from '../../package.json';

export default function VersionPage() {

	const buildLabel: string = (packageJson as { buildInfo?: { label?: string } }).buildInfo?.label ?? 'unknown';

	return (
		<div className="p-6">
                <h1 className="text-2xl font-semibold">アプリのバージョン</h1>
                <p className="mt-4">{buildLabel}</p>
		</div>
	);
}
