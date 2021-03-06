require 'mulberry/commands/spec_helper.rb'

%w( content code template).each do |type|
  require "mulberry/#{type}_creator.rb"
end

describe Mulberry::Command::Create do
  include Mulberry::Command::SpecHelpers

  describe '#commands' do
    it "should support all commands" do
      should_commands = %w(page feed data location component template capability store route)
      actual_commands = Mulberry::Command::Create.commands.collect{ |cmd| cmd[0].to_s }

      should_commands.sort.should == actual_commands.sort
    end
  end

  describe '#initialize' do
    before :each do
      @filename = 'foo'

      @locations = {
        :page => [ 'pages', "#{@filename}.md" ],
        :feed => [ 'assets', 'feeds', "#{@filename}.yml" ],
        :data => [ 'assets', 'data', "#{@filename}.yml" ],
        :location => [ 'assets', 'locations', "#{@filename}.yml" ],
        :component => [ 'javascript', 'components', "#{@filename}.js" ],
        :capability => [ 'javascript', 'capabilities', "#{@filename}.js" ],
        :store => [ 'javascript', 'stores', "#{@filename}.js" ],
        :route => [ 'javascript', 'routes.js' ],
        :template => [ 'templates', "#{@filename}.yml" ],
      }

      Dir.chdir File.join(Mulberry::Directories.root, @app.name)
    end

    Mulberry::Command::Create.commands.each do |command|
      it "should create #{command[0].to_s}" do
        Mulberry::Command::Create.new([command[0].to_s, @filename])
      end

      it "should raise an error if the filename includes spaces" do
        lambda {
          Mulberry::Command::Create.new([command[0].to_s, "foo bar"])
        }.should raise_error
      end

      it "should run the command from any dir" do
        Dir.chdir 'themes'
        Mulberry::Command::Create.new([command[0].to_s, @filename])
        Dir.chdir '..'
        File.exists?(File.join(@locations[command[0]])).should be_true
      end
    end

    after :each do
      Dir.chdir Mulberry::Directories.root
    end
  end
end
