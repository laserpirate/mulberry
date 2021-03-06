task :spec do
  $: << '.'
  dirs = Dir.glob('spec/*').select { |d| !d.match('integration') }.join(' ')
  system %{rspec --color --format doc #{dirs}}

  # separate out integration tests because each set needs to run using its own server
  Dir.glob('spec/integration/*').each do |d|
    system %{rspec --color --format doc #{d}}
  end

  Rake::Task['jshint'].execute

end

task :default => :spec
