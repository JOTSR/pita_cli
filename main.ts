import {
	Command,
	DenoLandProvider,
	prompt,
	Select,
	UpgradeCommand,
} from './deps.ts'
import { bench, benchPrompt } from './cli/bench.ts'
import { build, buildPrompt } from './cli/build.ts'
import { implement, implementPrompt } from './cli/implement.ts'
import { init, initPrompt } from './cli/init.ts'
import { mock, mockPrompt } from './cli/mock.ts'
import { requirements, requirementsPrompt } from './cli/requirements.ts'
import { test, testPrompt } from './cli/test.ts'

if (import.meta.main) {
	const upgradeCommand = new UpgradeCommand({
		main: 'main.ts',
		args: [
			'--name pita',
			'--allow-all',
		],
		provider: new DenoLandProvider(),
	})

	const main = new Command()
		.name('pita')
		.version('0.1.1')
		.meta('deno', Deno.version.deno)
		.description('🫓 Project manager for RedPitaya web apps 🫓')
		.command('requirements', requirements)
		.command('init', init)
		.command('build', build)
		.command('implement', implement)
		.command('test', test)
		.command('bench', bench)
		.command('mock', mock)
		.command('upgrade', upgradeCommand)
	await main.parse(Deno.args)

	if (Deno.args.length === 0) {
		const options = [
			'check tools requirements',
			'init a new pita 🫓 project',
			'build current project',
			'implement a build into a redpitaya board',
			'test current project',
			'bench current project',
			'mock redpitaya board to previewing app',
			'upgrade 🫓 cli',
			'show help',
		] as const

		const { command } = await prompt([{
			name: 'command',
			message: 'Select a command',
			type: Select,
			options: [...options],
		}])

		switch (command as typeof options[number]) {
			case 'check tools requirements':
				await requirementsPrompt()
				break
			case 'init a new pita 🫓 project':
				await initPrompt()
				break
			case 'bench current project':
				await benchPrompt()
				break
			case 'build current project':
				await buildPrompt()
				break
			case 'implement a build into a redpitaya board':
				await implementPrompt()
				break
			case 'mock redpitaya board to previewing app':
				await mockPrompt()
				break
			case 'test current project':
				await testPrompt()
				break
			case 'upgrade 🫓 cli':
				await upgradeCommand.parse()
				break
			case 'show help':
			default:
				main.showHelp()
		}
	}
}
