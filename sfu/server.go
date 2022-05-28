package server

import (
	"github.com/pion/ion-sfu/pkg/sfu"
	"github.com/spf13/viper"
	"github.com/rs/zerolog/log"
)

var conf sfu.Config

func load() bool {
	viper.SetConfigFile("config.toml")
	viper.SetConfigType("toml")

	err := viper.ReadInConfig()
	if err != nil {
		log.Fatal().Err(err).Msg("config file read failed")
		return false
	}
	err = viper.GetViper().Unmarshal(&conf)
	if err != nil {
		log.Fatal().Err(err).Msg("config file couldn't be parsed")
		return false
	}

	return true
}

func Start() (*sfu.SFU) {
	load()

	conf.WebRTC.SDPSemantics = "unified-plan-with-fallback"
	s := sfu.NewSFU(conf)
	s.NewDatachannel(sfu.APIChannelLabel)

	return s
}
